import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  GitBranch,
  FolderGit2,
  GitPullRequest,
  ShieldCheck,
  ArrowRight,
  Star,
  Users,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-[#30363d] bg-[#010409] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
            <span>CodeHub</span>
          </Link>

          <div className="hidden md:flex gap-8 text-gray-300">
            <a href="#features" className="hover:text-white">
              Features
            </a>

            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>

            <a href="#tech" className="hover:text-white">
              Tech Stack
            </a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 border border-[#30363d] rounded-lg hover:bg-[#21262d]"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-green-500 opacity-10 blur-3xl -top-60 -left-60"></div>

        <div className="absolute w-[700px] h-[700px] rounded-full bg-blue-500 opacity-10 blur-3xl bottom-0 right-0"></div>

        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}

          <div>
            <span className="bg-[#161b22] border border-[#30363d] px-4 py-2 rounded-full text-green-400 text-sm">
              Build Your Own GitHub
            </span>

            <h1 className="text-6xl font-extrabold leading-tight mt-8">
              Version Control
              <br />
              Made
              <span className="text-green-500"> Simple</span>
            </h1>

            <p className="text-gray-400 mt-8 text-lg leading-8">
              CodeHub is a GitHub-inspired Version Control System built using
              React, Node.js, Express, Prisma and PostgreSQL.
              <br />
              <br />
              Create repositories, manage branches, commit files, create pull
              requests and collaborate like GitHub.
            </p>

            <div className="flex gap-5 mt-10">
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg flex items-center gap-2 font-semibold"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/repositories"
                className="border border-[#30363d] hover:bg-[#21262d] px-8 py-4 rounded-lg"
              >
                Explore Repositories
              </Link>
            </div>

            <div className="flex gap-10 mt-12">
              <div>
                <h2 className="text-4xl font-bold">100+</h2>
                <p className="text-gray-400">Commits</p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">50+</h2>
                <p className="text-gray-400">Branches</p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">20+</h2>
                <p className="text-gray-400">Pull Requests</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderGit2 size={32} className="text-green-400" />

                  <div>
                    <h2 className="font-bold text-xl">CodeHub</h2>

                    <p className="text-gray-400 text-sm">
                      GitHub Clone Repository
                    </p>
                  </div>
                </div>

                <Star className="text-yellow-400" />
              </div>

              <div className="border-t border-[#30363d] my-6"></div>

              <div className="space-y-5">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <GitBranch className="text-green-400" />
                    <span>main</span>
                  </div>

                  <span className="text-green-400">Active</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <GitPullRequest className="text-blue-400" />
                    <span>Open Pull Requests</span>
                  </div>

                  <span>12</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Users className="text-purple-400" />
                    <span>Contributors</span>
                  </div>

                  <span>8</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <ShieldCheck className="text-emerald-400" />
                    <span>Protected Branch</span>
                  </div>

                  <span>Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Part 2 starts here ===== */}

      {/* ================= FEATURES ================= */}

      <section id="features" className="py-24 bg-[#010409]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center">
            Everything you need for Version Control
          </h2>

          <p className="text-gray-400 text-center mt-5 max-w-3xl mx-auto">
            CodeHub provides repository management, commits, branches, pull
            requests and collaboration inspired by GitHub.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 hover:border-green-500 transition">
              <GitBranch size={42} className="text-green-400 mb-5" />

              <h3 className="text-2xl font-bold">Branches</h3>

              <p className="text-gray-400 mt-4 leading-7">
                Create unlimited branches, switch branches and work
                independently without affecting the main branch.
              </p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 hover:border-blue-500 transition">
              <FolderGit2 size={42} className="text-blue-400 mb-5" />

              <h3 className="text-2xl font-bold">Repository</h3>

              <p className="text-gray-400 mt-4 leading-7">
                Organize projects with repositories just like GitHub. Store and
                manage files efficiently.
              </p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 hover:border-purple-500 transition">
              <GitPullRequest size={42} className="text-purple-400 mb-5" />

              <h3 className="text-2xl font-bold">Pull Requests</h3>

              <p className="text-gray-400 mt-4 leading-7">
                Create Pull Requests, review code, approve changes and merge
                branches.
              </p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 hover:border-yellow-500 transition">
              <ShieldCheck size={42} className="text-yellow-400 mb-5" />

              <h3 className="text-2xl font-bold">Secure Workflow</h3>

              <p className="text-gray-400 mt-4 leading-7">
                JWT Authentication, branch protection, commit history and file
                version tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#161b22] rounded-xl p-8 text-center">
              <h2 className="text-5xl font-bold text-green-400">100+</h2>

              <p className="mt-4 text-gray-400">Repositories</p>
            </div>

            <div className="bg-[#161b22] rounded-xl p-8 text-center">
              <h2 className="text-5xl font-bold text-blue-400">1K+</h2>

              <p className="mt-4 text-gray-400">Commits</p>
            </div>

            <div className="bg-[#161b22] rounded-xl p-8 text-center">
              <h2 className="text-5xl font-bold text-purple-400">250+</h2>

              <p className="mt-4 text-gray-400">Branches</p>
            </div>

            <div className="bg-[#161b22] rounded-xl p-8 text-center">
              <h2 className="text-5xl font-bold text-yellow-400">80+</h2>

              <p className="mt-4 text-gray-400">Pull Requests</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section id="workflow" className="py-24 bg-[#010409]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold">How CodeHub Works</h2>

          <p className="text-center text-gray-400 mt-4">
            Simple workflow inspired by GitHub
          </p>

          <div className="grid md:grid-cols-4 gap-8 mt-20">
            <div className="bg-[#161b22] p-8 rounded-xl border border-[#30363d]">
              <div className="text-5xl font-bold text-green-400">1</div>

              <h3 className="text-2xl font-bold mt-6">Create Repository</h3>

              <p className="text-gray-400 mt-4 leading-7">
                Start a new project by creating a repository and adding files.
              </p>
            </div>

            <div className="bg-[#161b22] p-8 rounded-xl border border-[#30363d]">
              <div className="text-5xl font-bold text-blue-400">2</div>

              <h3 className="text-2xl font-bold mt-6">Create Branch</h3>

              <p className="text-gray-400 mt-4 leading-7">
                Work on new features in separate branches safely.
              </p>
            </div>

            <div className="bg-[#161b22] p-8 rounded-xl border border-[#30363d]">
              <div className="text-5xl font-bold text-purple-400">3</div>

              <h3 className="text-2xl font-bold mt-6">Commit Changes</h3>

              <p className="text-gray-400 mt-4 leading-7">
                Save snapshots of your project using commits.
              </p>
            </div>

            <div className="bg-[#161b22] p-8 rounded-xl border border-[#30363d]">
              <div className="text-5xl font-bold text-yellow-400">4</div>

              <h3 className="text-2xl font-bold mt-6">Merge PR</h3>

              <p className="text-gray-400 mt-4 leading-7">
                Create Pull Requests, review code and merge into main.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Part 3 starts here ===== */}
      {/* ================= TECH STACK ================= */}

      <section id="tech" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center">
            Built With Modern Technologies
          </h2>

          <p className="text-center text-gray-400 mt-5">
            CodeHub is powered by a modern full-stack architecture.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-16">
            {[
              "React",
              "Node.js",
              "Express",
              "PostgreSQL",
              "Prisma",
              "Tailwind CSS",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-center hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold">{tech}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="py-24 bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0d1117]">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold">Ready to Build with CodeHub?</h2>

          <p className="text-gray-400 text-lg mt-6">
            Manage repositories, track commits, create branches, and collaborate
            through Pull Requests — all in one place.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-10 bg-green-600 hover:bg-green-700 px-10 py-4 rounded-lg text-xl font-semibold transition"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-[#30363d] bg-[#010409]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}

            <div>
              <h2 className="text-3xl font-bold text-white">CodeHub</h2>

              <p className="text-gray-400 mt-5 leading-7">
                A GitHub-inspired Version Control System built using React,
                Node.js, Express, Prisma and PostgreSQL.
              </p>
            </div>

            {/* Product */}

            <div>
              <h3 className="font-bold text-xl mb-5">Product</h3>

              <ul className="space-y-3 text-gray-400">
                <li>Repositories</li>
                <li>Branches</li>
                <li>Commits</li>
                <li>Pull Requests</li>
              </ul>
            </div>

            {/* Resources */}

            <div>
              <h3 className="font-bold text-xl mb-5">Resources</h3>

              <ul className="space-y-3 text-gray-400">
                <li>Documentation</li>
                <li>API</li>
                <li>Community</li>
                <li>Support</li>
              </ul>
            </div>

            {/* Connect */}

            <div>
              <h3 className="font-bold text-xl mb-5">Connect</h3>

              <ul className="space-y-3 text-gray-400">
                <li>GitHub</li>
                <li>LinkedIn</li>
                <li>Email</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#30363d] mt-14 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CodeHub. All Rights Reserved.
            </p>

            <div className="flex gap-6 mt-4 md:mt-0 text-gray-400">
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>

              <a href="#" className="hover:text-white transition">
                Terms
              </a>

              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
