#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import readline from "readline";
import axios from "axios";
import chalk from "chalk";

const API_BASE = "http://localhost:5000/api";

const GLOBAL_CONFIG_DIR = path.join(os.homedir(), ".codehub");
const GLOBAL_CONFIG_PATH = path.join(GLOBAL_CONFIG_DIR, "config.json");
const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".codehub.json");

const args = process.argv.slice(2);
const command = args[0];

// ===============================
// Helpers
// ===============================

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function askHidden(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);

    stdin.resume();
    stdin.setRawMode(true);

    let input = "";

    const onData = (char) => {
      char = char.toString();

      if (char === "\r" || char === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(input);
      } else if (char === "\u0003") {
        process.exit();
      } else if (char === "\u007f") {
        input = input.slice(0, -1);
      } else {
        input += char;
      }
    };

    stdin.on("data", onData);
  });
}

function getGlobalConfig() {
  if (!fs.existsSync(GLOBAL_CONFIG_PATH)) return null;
  return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
}

function saveGlobalConfig(data) {
  if (!fs.existsSync(GLOBAL_CONFIG_DIR)) {
    fs.mkdirSync(GLOBAL_CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(GLOBAL_CONFIG_PATH, JSON.stringify(data, null, 2));
}

function getLocalConfig() {
  if (!fs.existsSync(LOCAL_CONFIG_PATH)) return null;
  return JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
}

function saveLocalConfig(data) {
  fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(data, null, 2));
}

function getToken() {
  const config = getGlobalConfig();
  if (!config || !config.token) {
    console.log(chalk.red("Not logged in. Run 'codehub login' first."));
    process.exit(1);
  }
  return config.token;
}

const IGNORE = [
  "node_modules",
  ".git",
  ".codehub.json",
  "codehub-cli",
  ".DS_Store",
];

function walkDir(dir, baseDir = dir, fileList = []) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    if (IGNORE.includes(entry)) continue;

    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath, baseDir, fileList);
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      fileList.push(relativePath);
    }
  }

  return fileList;
}

// ===============================
// Commands
// ===============================

async function login() {
  const email = await ask("Email: ");
  const password = await askHidden("Password: ");

  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });

    saveGlobalConfig({
      token: res.data.token,
      email: res.data.user.email,
    });

    console.log(chalk.green(`\n✔ Logged in as ${res.data.user.email}`));
  } catch (error) {
    console.log(
      chalk.red(
        `\n✘ Login failed: ${error.response?.data?.message || error.message}`,
      ),
    );
    process.exit(1);
  }
}

function logout() {
  if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
    fs.unlinkSync(GLOBAL_CONFIG_PATH);
  }
  console.log(chalk.green("✔ Logged out"));
}

async function init() {
  const token = getToken();

  if (getLocalConfig()) {
    console.log(chalk.yellow("This folder is already linked to a repository."));
    return;
  }

  try {
    const res = await axios.get(`${API_BASE}/repositories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const repos = res.data.repositories;

    if (!repos || repos.length === 0) {
      console.log(
        chalk.red("No repositories found. Create one first on CodeHub."),
      );
      return;
    }

    console.log(chalk.bold("\nYour repositories:"));
    repos.forEach((repo, i) => {
      console.log(`  ${i + 1}. ${repo.name} (id: ${repo.id})`);
    });

    const choice = await ask("\nEnter repository number: ");
    const index = Number(choice) - 1;
    const selectedRepo = repos[index];

    if (!selectedRepo) {
      console.log(chalk.red("Invalid selection."));
      return;
    }

    const branchRes = await axios.get(
      `${API_BASE}/branches/repository/${selectedRepo.id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const branches = branchRes.data.data;

    console.log(chalk.bold("\nBranches:"));
    branches.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.name} (id: ${b.id})`);
    });

    const branchChoice = await ask("\nEnter branch number (default 1): ");
    const branchIndex = branchChoice ? Number(branchChoice) - 1 : 0;
    const selectedBranch = branches[branchIndex] || branches[0];

    saveLocalConfig({
      repositoryId: selectedRepo.id,
      repositoryName: selectedRepo.name,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
    });

    console.log(
      chalk.green(
        `\n✔ Linked this folder to "${selectedRepo.name}" (branch: ${selectedBranch.name})`,
      ),
    );
  } catch (error) {
    console.log(
      chalk.red(
        `\n✘ Init failed: ${error.response?.data?.message || error.message}`,
      ),
    );
  }
}

async function push() {
  const token = getToken();
  const localConfig = getLocalConfig();

  if (!localConfig) {
    console.log(
      chalk.red("This folder isn't linked. Run 'codehub init' first."),
    );
    return;
  }

  const { repositoryId, branchId } = localConfig;

  const files = walkDir(process.cwd());

  if (files.length === 0) {
    console.log(chalk.yellow("No files found to push."));
    return;
  }

  console.log(chalk.bold(`\nPushing ${files.length} file(s)...\n`));

  const existingRes = await axios.get(
    `${API_BASE}/files/repository/${repositoryId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const existingFiles = existingRes.data.data;

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const relativePath of files) {
    const fullPath = path.join(process.cwd(), relativePath);
    const content = fs.readFileSync(fullPath, "utf-8");

    const filename = relativePath.split(path.sep).join("/");

    const existing = existingFiles.find((f) => f.filename === filename);

    try {
      if (existing) {
        await axios.put(
          `${API_BASE}/files/${existing.id}`,
          {
            content,
            message: `Updated ${filename} via CLI push`,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(chalk.blue(`  ↻ updated  ${filename}`));
        updated++;
      } else {
        await axios.post(
          `${API_BASE}/files/create`,
          {
            name: filename,
            filename,
            content,
            repositoryId,
            branchId,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(chalk.green(`  + created  ${filename}`));
        created++;
      }
    } catch (error) {
      console.log(
        chalk.red(
          `  ✘ failed   ${filename} — ${
            error.response?.data?.message || error.message
          }`,
        ),
      );
      failed++;
    }
  }

  console.log(
    chalk.bold(
      `\n✔ Push complete: ${created} created, ${updated} updated, ${failed} failed`,
    ),
  );
}

function printHelp() {
  console.log(`
${chalk.bold("CodeHub CLI")}

Usage:
  codehub login      Log in to your CodeHub account
  codehub logout     Log out
  codehub init       Link current folder to a repository
  codehub push       Push all files in this folder to the linked repository
  codehub help       Show this help message
`);
}

// ===============================
// Router
// ===============================

switch (command) {
  case "login":
    login();
    break;
  case "logout":
    logout();
    break;
  case "init":
    init();
    break;
  case "push":
    push();
    break;
  default:
    printHelp();
}
