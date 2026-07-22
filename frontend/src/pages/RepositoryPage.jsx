import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function RepositoryPage() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);

  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");

  const [commits, setCommits] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");

  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);

  // Pull Request
  const [pullRequests, setPullRequests] = useState([]);

  const [prTitle, setPrTitle] = useState("");
  const [prDescription, setPrDescription] = useState("");

  const [sourceBranchId, setSourceBranchId] = useState("");
  const [targetBranchId, setTargetBranchId] = useState("");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchRepository();
    fetchPullRequests();
  }, [id]);

  useEffect(() => {
    if (currentBranch?.id) {
      fetchCommits();
    }
  }, [currentBranch]);

  // =========================
  // FETCH REPOSITORY
  // =========================

  const fetchRepository = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/repositories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const repo = res.data.repository;

      setRepository(repo);

      setBranches(repo.branches || []);

      setCurrentBranch(repo.currentBranch || null);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // =========================
  // FETCH COMMITS
  // =========================

  const fetchCommits = async () => {
    try {
      if (!currentBranch?.id) return;

      const token = localStorage.getItem("token");

      const res = await api.get(`/branches/branch/${currentBranch.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCommits(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // FETCH PULL REQUEST
  // =========================

  const fetchPullRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/pullrequests/repository/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Pull Request:", res.data);

      setPullRequests(res.data.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);

      // Dummy data for UI testing

      setPullRequests([
        {
          id: 1,
          title: "Test Pull Request",
          description: "Frontend testing PR",
          status: "OPEN",
          sourceBranchId: 2,
          targetBranchId: 1,
        },
      ]);
    }
  };

  // =====================
  // Approve Pull Request
  // =====================

  // =========================
  // CREATE PULL REQUEST
  // =========================

  const createPullRequest = async () => {
    try {
      if (!sourceBranchId || !targetBranchId) {
        alert("Select source and target branch");

        return;
      }

      const token = localStorage.getItem("token");

      await api.post(
        "/pullrequests/create",
        {
          title: prTitle,

          description: prDescription,

          sourceBranchId: Number(sourceBranchId),

          targetBranchId: Number(targetBranchId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Pull Request Created");

      setPrTitle("");

      setPrDescription("");

      setSourceBranchId("");

      setTargetBranchId("");

      fetchPullRequests();
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert("PR Creation Failed");
    }
  };

  if (!repository) {
    return (
      <div className="bg-[#0d1117] min-h-screen text-white p-8">Loading...</div>
    );
  }

  // =====================
  // Approve Pull Request
  // =====================

  const approvePullRequest = async (prId) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/pullrequests/approve/${prId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Pull Request Approved");

      fetchPullRequests();
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert("Approve failed");
    }
  };

  // =====================
  // Merge Pull Request
  // =====================

  const mergePullRequest = async (prId) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/pullrequests/merge/${prId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Pull Request Merged");

      fetchPullRequests();
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert("Merge failed");
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold">{repository.name}</h1>

      <p className="text-gray-400 mt-2">{repository.description}</p>

      {/* =========================
CURRENT BRANCH
========================= */}

      <div className="mt-5 bg-[#161b22] p-5 rounded border border-[#30363d]">
        <h2 className="text-xl font-bold">Current Branch</h2>

        <p className="text-green-400 mt-2">
          🌿 {currentBranch?.name || "No Branch"}
        </p>
      </div>

      {/* =========================
BRANCH LIST
========================= */}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Branches</h2>

        {branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-[#161b22] p-3 mt-3 rounded flex justify-between"
          >
            <p>{branch.name}</p>

            <button
              className="bg-blue-600 px-4 py-1 rounded"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");

                  await api.post(
                    `/branches/switch/${branch.id}`,

                    {},

                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  alert("Branch switched");

                  fetchRepository();
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Switch
            </button>
          </div>
        ))}
      </div>

      {/* =========================
STATS
========================= */}

      <div className="mt-8 flex gap-5">
        <div className="bg-[#161b22] p-5 rounded">
          <h3>Files</h3>

          <p>{repository.files?.length || 0}</p>
        </div>

        <div className="bg-[#161b22] p-5 rounded">
          <h3>Commits</h3>

          <p>{commits.length}</p>
        </div>

        <div className="bg-[#161b22] p-5 rounded">
          <h3>Pull Requests</h3>

          <p>{pullRequests.length}</p>
        </div>
      </div>

      {/* =========================
ADD FILE
========================= */}

      <div className="mt-10 bg-[#161b22] p-5 rounded">
        <h2 className="text-2xl font-bold">Add File</h2>

        <input
          className="w-full mt-3 p-3 bg-[#0d1117] border rounded"
          placeholder="Filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />

        <textarea
          className="w-full mt-3 p-3 bg-[#0d1117] border rounded"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="bg-blue-600 px-5 py-2 mt-3 rounded"
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");

              await api.post(
                "/files/create",

                {
                  repositoryId: id,

                  filename,

                  content,
                },

                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              setFilename("");

              setContent("");

              fetchRepository();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Add File
        </button>
      </div>

      {/* =========================
FILES
========================= */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Repository Files</h2>

        {repository.files?.map((file) => (
          <div key={file.id} className="bg-[#161b22] border p-4 mt-3 rounded">
            <h3 className="text-blue-400">📄 {file.filename}</h3>

            <p className="text-gray-400 mt-2">{file.content}</p>
          </div>
        ))}
      </div>

      {/* =========================
CREATE COMMIT
========================= */}

      <div className="mt-10 bg-[#161b22] p-5 rounded">
        <h2 className="text-2xl font-bold">Create Commit</h2>

        <input
          className="w-full mt-3 p-3 bg-[#0d1117] border rounded"
          placeholder="Commit Message"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
        />

        <button
          className="bg-green-600 px-5 py-2 mt-3 rounded"
          onClick={async () => {
            try {
              if (!currentBranch) {
                alert("No branch selected");

                return;
              }

              const token = localStorage.getItem("token");

              await api.post(
                "/commits",

                {
                  repositoryId: id,

                  branchId: currentBranch.id,

                  message: commitMessage,
                },

                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              alert("Commit Created");

              setCommitMessage("");

              fetchCommits();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Commit
        </button>
      </div>

      {/* =========================
COMMIT HISTORY
========================= */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Commit History</h2>

        {commits.length > 0 ? (
          commits.map((commit) => (
            <div
              key={commit.id}
              className="bg-[#161b22] border p-4 mt-3 rounded"
            >
              <h3 className="text-green-400">{commit.message}</h3>

              <p className="text-gray-400 text-sm">
                {new Date(commit.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No commits yet</p>
        )}
      </div>

      {/* =====================
    CREATE PULL REQUEST
===================== */}

      <div className="mt-10 bg-[#161b22] p-5 rounded">
        <h2 className="text-2xl font-bold">Create Pull Request</h2>

        {/* Source Branch */}

        <select
          className="w-full mt-4 p-3 bg-[#0d1117] border rounded"
          value={sourceBranchId}
          onChange={(e) => setSourceBranchId(e.target.value)}
        >
          <option value="">Select Source Branch</option>

          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        {/* Target Branch */}

        <select
          className="w-full mt-4 p-3 bg-[#0d1117] border rounded"
          value={targetBranchId}
          onChange={(e) => setTargetBranchId(e.target.value)}
        >
          <option value="">Select Target Branch</option>

          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        {/* Title */}

        <input
          className="w-full mt-4 p-3 bg-[#0d1117] border rounded"
          placeholder="Pull Request Title"
          value={prTitle}
          onChange={(e) => setPrTitle(e.target.value)}
        />

        {/* Description */}

        <textarea
          className="w-full mt-4 p-3 bg-[#0d1117] border rounded"
          placeholder="Pull Request Description"
          value={prDescription}
          onChange={(e) => setPrDescription(e.target.value)}
        />

        <button
          onClick={createPullRequest}
          className="mt-4 bg-purple-600 px-5 py-2 rounded"
        >
          Create Pull Request
        </button>
      </div>

      {/* =====================
          Pull Request List
      ===================== */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Pull Requests</h2>

        {pullRequests.length > 0 ? (
          pullRequests.map((pr) => (
            <div
              key={pr.id}
              className="bg-[#161b22] border border-[#30363d] p-4 mt-3 rounded"
            >
              <div className="flex justify-between">
                <h3 className="text-xl text-blue-400">{pr.title}</h3>

                <span
                  className={
                    pr.status === "OPEN"
                      ? "text-yellow-400"
                      : pr.status === "APPROVED"
                        ? "text-green-400"
                        : pr.status === "MERGED"
                          ? "text-blue-400"
                          : "text-red-400"
                  }
                >
                  {pr.status}
                </span>
              </div>

              <p className="text-gray-400 mt-2">{pr.description}</p>

              <div className="mt-3 text-gray-500 text-sm">
                <p>
                  Source Branch: {pr.sourceBranch?.name || pr.sourceBranchId}
                </p>

                <p>
                  Target Branch: {pr.targetBranch?.name || pr.targetBranchId}
                </p>

                <p>Created At: {new Date(pr.createdAt).toLocaleString()}</p>
              </div>

              {/* Future Buttons */}

              {pr.status === "OPEN" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => approvePullRequest(pr.id)}
                    className="bg-green-600 px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                </div>
              )}
              {pr.status === "APPROVED" && (
                <button
                  onClick={() => mergePullRequest(pr.id)}
                  className="bg-blue-600 px-4 py-2 rounded mt-4"
                >
                  Merge
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-3">No Pull Requests Found</p>
        )}
      </div>
      {/* =========================
GO TO BRANCHES
========================= */}

      <div className="mt-5">
        <Link
          to={`/repository/${id}/branches`}
          className="bg-purple-600 px-5 py-2 rounded inline-block"
        >
          View Branches
        </Link>
        <Link to={`/repository/${id}/branches`}>Branches </Link>
      </div>
    </div>
  );
}

export default RepositoryPage;
