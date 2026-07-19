import { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import API from "../api/axios";
import { GitBranch, File, GitCommit, Plus, GitPullRequest } from "lucide-react";

function RepositoryDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [repository, setRepository] = useState(null);

  const [files, setFiles] = useState([]);

  const [commits, setCommits] = useState([]);

  const [branches, setBranches] = useState([]);

  const [showBranchModal, setShowBranchModal] = useState(false);

  const [branchName, setBranchName] = useState("");

  const [currentBranch, setCurrentBranch] = useState("main");

  const [showFileModal, setShowFileModal] = useState(false);

  const [filename, setFilename] = useState("");

  const [content, setContent] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [editContent, setEditContent] = useState("");

  const [showPRModal, setShowPRModal] = useState(false);

  const [prTitle, setPrTitle] = useState("");

  const [prDescription, setPrDescription] = useState("");

  const [sourceBranch, setSourceBranch] = useState("");

  const [targetBranch, setTargetBranch] = useState("");

  const [pullRequests, setPullRequests] = useState([]);

  const openFile = (file) => {
    console.log("SELECTED FILE:", file);
    setSelectedFile(file);

    setEditContent(file.content);

    setEditMode(false);
  };

  const saveFile = async () => {
    try {
      const response = await API.put(`/files/${selectedFile.id}`, {
        content: editContent,

        message: `Updated ${selectedFile.filename}`,
      });

      console.log("UPDATE FILE RESPONSE:", response.data);

      // update files list
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === selectedFile.id
            ? {
                ...file,
                content: editContent,
              }
            : file,
        ),
      );

      // update selected file
      setSelectedFile({
        ...selectedFile,
        content: editContent,
      });

      setEditMode(false);

      alert("File updated successfully");
    } catch (error) {
      console.log("UPDATE FILE ERROR:", error.response?.data || error.message);
    }
  };
  const createFile = async () => {
    try {
      if (!filename) {
        alert("Filename required");
        return;
      }

      const response = await API.post("/files/create", {
        filename,
        content,
        repositoryId: id,
      });

      console.log("CREATE FILE:", response.data);

      setFilename("");
      setContent("");

      setShowFileModal(false);

      // refresh files
      getFiles();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const getRepository = async () => {
    try {
      const repoResponse = await API.get(`/repositories/${id}`);

      console.log("REPOSITORY RESPONSE:", repoResponse.data);

      setRepository(repoResponse.data.repository);
    } catch (error) {
      console.log("REPOSITORY ERROR:", error.response?.data || error.message);
    }
  };

  const getFiles = async () => {
    try {
      const response = await API.get(`/files/repository/${id}`);

      console.log("FILES RESPONSE:", response.data);

      setFiles(response.data.data);
    } catch (error) {
      console.log("FILES ERROR:", error.response?.data || error.message);
    }
  };

  const getCommits = async () => {
    try {
      const response = await API.get(`/commits/repository/${id}`);

      console.log("COMMITS RESPONSE:", response.data);

      setCommits(response.data.data);
    } catch (error) {
      console.log("COMMITS ERROR:", error.response?.data || error.message);
    }
  };

  const getBranches = async () => {
    try {
      const response = await API.get(`/branches/repository/${id}`);

      console.log("BRANCH RESPONSE:", response.data);

      setBranches(response.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const getPullRequests = async () => {
    try {
      const response = await API.get(`/pullrequests/repository/${id}`);

      console.log("FULL PR RESPONSE:", response);
      console.log("PR DATA:", response.data.data);

      setPullRequests(response.data.data);
    } catch (error) {
      console.log("PR FETCH ERROR:", error.response?.data || error.message);
    }
  };
  const createBranch = async () => {
    try {
      if (!branchName.trim()) {
        alert("Branch name required");
        return;
      }

      const response = await API.post("/branches/create", {
        name: branchName,
        repositoryId: id,
      });

      console.log("CREATE BRANCH RESPONSE:", response.data);

      setBranchName("");

      setShowBranchModal(false);

      // refresh branches
      getBranches();
    } catch (error) {
      console.log(
        "CREATE BRANCH ERROR:",
        error.response?.data || error.message,
      );
    }
  };

  const createPullRequest = async () => {
    try {
      if (!prTitle || !sourceBranch) {
        alert("Title and source branch required");
        return;
      }

      const response = await API.post("/pullrequests/create", {
        title: prTitle,

        description: prDescription,

        repositoryId: id,

        sourceBranchId: sourceBranch,

        targetBranchId: targetBranch,
      });

      console.log("PR CREATED:", response.data);

      setPrTitle("");

      setPrDescription("");

      setSourceBranch("");

      setShowPRModal(false);

      await getPullRequests();

      alert("Pull Request Created");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    console.log("Repository ID:", id);

    getRepository();
    getFiles();
    getCommits();
    getBranches();
    getPullRequests();
  }, [id]);

  useEffect(() => {
    if (currentBranch) {
      getFiles();
    }
  }, [currentBranch]);

  if (!repository) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-10">
      {/* Header */}

      <div className="border-b border-[#30363d] pb-8">
        <h1 className="text-4xl font-bold">{repository.name}</h1>

        <p className="text-gray-400 mt-3">
          {repository.description || "No description"}
        </p>

        <div className="flex gap-5 mt-6">
          <select
            className="bg-[#161b22] border border-[#30363d] px-5 py-2 rounded-lg"
            value={currentBranch}
            onChange={(e) => setCurrentBranch(e.target.value)}
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowBranchModal(true)}
            className="bg-green-600 px-5 py-2 rounded-lg"
          >
            + New Branch
          </button>
          <button
            onClick={() => setShowFileModal(true)}
            className="bg-green-600 px-5 py-2 rounded-lg flex gap-2 items-center"
          >
            <Plus size={20} />
            Add File
          </button>
          <button
            onClick={() => setShowPRModal(true)}
            className="
  bg-purple-600
  px-5
  py-2
  rounded-lg
  flex
  gap-2
  items-center
  "
          >
            <GitPullRequest size={20} />
            Create PR
          </button>
        </div>
      </div>

      {/* ================= CREATE PR MODAL ================= */}

      {showPRModal && (
        <div
          className="
    fixed
    inset-0
    bg-black/70
    flex
    items-center
    justify-center
    z-50
    "
        >
          <div
            className="
      bg-[#161b22]
      border
      border-[#30363d]
      rounded-xl
      w-[500px]
      p-8
      "
          >
            <h2 className="text-2xl font-bold mb-5">Create Pull Request</h2>

            <input
              placeholder="PR Title"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              className="
        w-full
        bg-[#0d1117]
        border
        border-[#30363d]
        p-3
        rounded-lg
        mb-4
        "
            />

            <textarea
              placeholder="Description"
              value={prDescription}
              onChange={(e) => setPrDescription(e.target.value)}
              className="
        w-full
        h-32
        bg-[#0d1117]
        border
        border-[#30363d]
        p-3
        rounded-lg
        mb-4
        "
            />

            <select
              value={sourceBranch}
              onChange={(e) => setSourceBranch(e.target.value)}
              className="
        w-full
        bg-[#0d1117]
        border
        border-[#30363d]
        p-3
        rounded-lg
        mb-4
        "
            >
              <option value="">Select Source Branch</option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <select
              value={targetBranch}
              onChange={(e) => setTargetBranch(e.target.value)}
              className="
        w-full
        bg-[#0d1117]
        border
        border-[#30363d]
        p-3
        rounded-lg
        mb-5
        "
            >
              <option value="">Select Target Branch</option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPRModal(false)}
                className="
          border
          border-[#30363d]
          px-5
          py-2
          rounded-lg
          "
              >
                Cancel
              </button>

              <button
                onClick={createPullRequest}
                className="
          bg-purple-600
          px-5
          py-2
          rounded-lg
          "
              >
                Create PR
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= FILE VIEW MODAL ================= */}

      {selectedFile && (
        <div
          className="
          fixed
          inset-0
          bg-black/70
          flex
          items-center
          justify-center
          z-50
          "
        >
          <div
            className="
            bg-[#161b22]
            border
            border-[#30363d]
            rounded-xl
            w-[800px]
            p-8
            "
          >
            {/* Header */}

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">{selectedFile.filename}</h2>

              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Editor */}

            {editMode ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="
                  w-full
                  h-96
                  bg-[#0d1117]
                  border
                  border-[#30363d]
                  rounded-lg
                  p-5
                  font-mono
                  text-white
                  "
              />
            ) : (
              <pre
                className="
                  w-full
                  h-96
                  bg-[#0d1117]
                  border
                  border-[#30363d]
                  rounded-lg
                  p-5
                  overflow-auto
                  font-mono
                  text-white
                  "
              >
                {selectedFile.content || "Empty file"}
              </pre>
            )}

            {/* Buttons */}

            <div className="flex justify-end gap-4 mt-6">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);

                      setEditContent(selectedFile.content);
                    }}
                    className="
border
border-[#30363d]
px-6
py-2
rounded-lg
"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveFile}
                    className="
bg-green-600
hover:bg-green-700
px-6
py-2
rounded-lg
"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="
bg-blue-600
hover:bg-blue-700
px-6
py-2
rounded-lg
"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Files */}

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-5">Files</h2>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl">
          {files.length === 0 ? (
            <p className="p-5 text-gray-400">No files found</p>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                onClick={() => openFile(file)}
                className="p-5 border-b border-[#30363d] flex items-center gap-3 cursor-pointer hover:bg-[#21262d]
"
              >
                <File size={22} className="text-blue-400" />

                <span>{file.filename}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Pull Requests */}

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-5 flex gap-2 items-center">
          <GitPullRequest />
          Pull Requests
        </h2>

        <div className="space-y-4">
          {pullRequests.length === 0 ? (
            <p className="text-gray-400">No Pull Requests</p>
          ) : (
            pullRequests.map((pr) => (
              <div
                key={pr.id}
                className="
bg-[#161b22]
border
border-[#30363d]
rounded-xl
p-5
"
              >
                <h3 className="text-xl font-bold">{pr.title}</h3>

                <p className="text-gray-400 mt-2">{pr.description}</p>

                <div className="mt-3 text-sm">
                  <p>
                    From:
                    <span className="text-green-400 ml-2">
                      {pr.sourceBranch?.name}
                    </span>
                  </p>

                  <p>
                    To:
                    <span className="text-blue-400 ml-2">
                      {pr.targetBranch?.name}
                    </span>
                  </p>

                  <p className="mt-2">
                    Status:
                    <span className="ml-2 text-yellow-400">{pr.status}</span>
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    className="
  bg-green-600
  px-4
  py-2
  rounded
  "
                    onClick={async () => {
                      try {
                        await API.put(`/pullrequests/${pr.id}/approve`);

                        getPullRequests();
                      } catch (error) {
                        console.log(
                          "APPROVE ERROR:",
                          error.response?.data || error.message,
                        );
                      }
                    }}
                  >
                    Approve
                  </button>

                  <button
                    className="
  bg-red-600
  px-4
  py-2
  rounded
  "
                    onClick={async () => {
                      try {
                        const response = await API.put(
                          `/pullrequests/${pr.id}/reject`,
                        );

                        console.log("REJECT RESPONSE:", response.data);

                        getPullRequests();
                      } catch (error) {
                        console.log(
                          "REJECT ERROR:",
                          error.response?.data || error.message,
                        );
                      }
                    }}
                  >
                    Reject
                  </button>

                  <button
                    className="
  bg-purple-600
  px-4
  py-2
  rounded
  "
                    onClick={async () => {
                      try {
                        const response = await API.put(
                          `/pullrequests/${pr.id}/merge`,
                        );

                        console.log("MERGE RESPONSE:", response.data);
                        alert("Pull Request Merged Successfully");

                        await getPullRequests();
                        await getFiles();
                        await getCommits();
                      } catch (error) {
                        console.log(
                          "MERGE ERROR:",
                          error.response?.data || error.message,
                        );

                        alert(error.response?.data?.message || "Merge Failed");
                      }
                    }}
                  >
                    Merge
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Commits */}

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-5">Commit History</h2>

        <div className="space-y-4">
          {commits.length === 0 ? (
            <p className="text-gray-400">No commits found</p>
          ) : (
            commits.map((commit) => (
              <div
                key={commit.id}
                onClick={() => navigate(`/commit/${commit.id}`)}
                className="
bg-[#161b22]
border
border-[#30363d]
p-5
rounded-xl
cursor-pointer
hover:bg-[#21262d]
"
              >
                <GitCommit className="text-green-400" />

                <div>
                  <h3 className="font-bold">{commit.message}</h3>

                  <p className="text-gray-400 text-sm">
                    {new Date(commit.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      {showBranchModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#161b22] p-8 rounded-xl w-96">
            <h2 className="text-2xl font-bold">Create Branch</h2>

            <input
              className="mt-5 w-full bg-[#0d1117] border border-[#30363d] p-3 rounded"
              placeholder="branch name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />

            <button
              onClick={createBranch}
              className="mt-5 bg-green-600 px-5 py-2 rounded"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {showFileModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-[600px] p-8">
            <h2 className="text-2xl font-bold mb-6">Create New File</h2>

            <input
              type="text"
              placeholder="filename e.g index.js"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 mb-5"
            />

            <textarea
              placeholder="Write your code..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="
w-full
h-64
bg-[#0d1117]
border
border-[#30363d]
rounded-lg
p-4
font-mono
text-sm
"
            ></textarea>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowFileModal(false)}
                className="border border-[#30363d] px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={createFile}
                className="bg-green-600 px-6 py-2 rounded-lg"
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RepositoryDetail;
