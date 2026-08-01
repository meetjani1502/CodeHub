import prisma from "../config/prisma.js";

// ===============================
// CREATE ISSUE
// ===============================
export const createIssue = async (req, res) => {
  try {
    const { title, description, repositoryId } = req.body;

    if (!title || !repositoryId) {
      return res.status(400).json({
        success: false,
        message: "Title and repositoryId are required",
      });
    }

    const repository = await prisma.repository.findUnique({
      where: { id: Number(repositoryId) },
    });

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        repositoryId: Number(repositoryId),
        authorId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    console.error("CREATE ISSUE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL ISSUES (all repositories)
// ===============================
export const getAllIssues = async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        repository: true,
        author: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    console.error("GET ALL ISSUES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ISSUES BY REPOSITORY
// ===============================
export const getIssuesByRepository = async (req, res) => {
  try {
    const repositoryId = Number(req.params.repositoryId);

    const issues = await prisma.issue.findMany({
      where: { repositoryId },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    console.error("GET REPO ISSUES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE ISSUE
// ===============================
export const getIssueById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        repository: true,
        author: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.json({
      success: true,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// CLOSE ISSUE
// ===============================
export const closeIssue = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const issue = await prisma.issue.findUnique({ where: { id } });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const updated = await prisma.issue.update({
      where: { id },
      data: { status: "CLOSED" },
    });

    res.json({
      success: true,
      message: "Issue closed",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// REOPEN ISSUE
// ===============================
export const reopenIssue = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const issue = await prisma.issue.findUnique({ where: { id } });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const updated = await prisma.issue.update({
      where: { id },
      data: { status: "OPEN" },
    });

    res.json({
      success: true,
      message: "Issue reopened",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
