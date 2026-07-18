import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function RepositoryPage() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);

  // Create File states
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");

  // Edit File states
  const [editFile, setEditFile] = useState(null);
  const [editFilename, setEditFilename] = useState("");
  const [editContent, setEditContent] = useState("");

  // Commit states
  const [commits, setCommits] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");

  useEffect(() => {
    fetchRepository();
    fetchCommits();
  }, []);

  // Fetch Repository

  const fetchRepository = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/repositories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRepository(response.data.repository);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Commits

  const fetchCommits = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/commits/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Commit Data:", response.data);

      setCommits(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const createCommit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!commitMessage.trim()) {
        alert("Please enter commit message");
        return;
      }

      await api.post(
        "/commits",
        {
          repositoryId: id,

          // temporary testing
          branchId: 7,

          message: commitMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Commit created successfully");

      setCommitMessage("");

      fetchCommits();
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Commit failed");
    }
  };

  // Create File

  const createFile = async () => {
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
  };

  // Delete File

  const deleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRepository((prev) => ({
        ...prev,

        files: prev.files.filter((file) => file.id !== fileId),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // Update File

  const updateFile = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/files/${editFile.id}`,

        {
          filename: editFilename,
          content: editContent,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditFile(null);
      setEditFilename("");
      setEditContent("");

      fetchRepository();
    } catch (error) {
      console.log(error);
    }
  };

  if (!repository) {
    return (
      <div className="bg-[#0d1117] min-h-screen text-white p-8">Loading...</div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold">{repository.name}</h1>

      <p className="text-gray-400 mt-2">{repository.description}</p>

      {/* Stats */}

      <div className="mt-8 flex gap-5">
        <div className="bg-[#161b22] p-5 rounded border border-[#30363d]">
          <h3 className="text-xl">Files</h3>

          <p>{repository.files?.length || 0}</p>
        </div>

        <div className="bg-[#161b22] p-5 rounded border border-[#30363d]">
          <h3 className="text-xl">Commits</h3>

          <p>{commits.length}</p>
        </div>
      </div>

      {/* Add File */}

      <div className="mt-10 bg-[#161b22] p-5 rounded">
        <h2 className="text-2xl">Add New File</h2>

        <input
          className="w-full mt-4 p-3 bg-[#0d1117] border"
          placeholder="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />

        <textarea
          className="w-full mt-4 p-3 bg-[#0d1117] border"
          placeholder="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createFile}
          className="mt-4 bg-blue-600 px-5 py-2 rounded"
        >
          Add File
        </button>
      </div>

      {/* Files */}

      <div className="mt-10">
        <h2 className="text-2xl">Repository Files</h2>

        {repository.files?.map((file) => (
          <div key={file.id} className="bg-[#161b22] border p-4 mt-3 rounded">
            <div className="flex justify-between">
              <h3 className="text-blue-400">📄 {file.filename}</h3>

              <div>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="mt-2 text-gray-400">{file.content}</p>
          </div>
        ))}
      </div>

      {/* Create Commit */}

      <div className="mt-10 bg-[#161b22] p-5 rounded">
        <h2 className="text-2xl font-bold">Create Commit</h2>

        <input
          type="text"
          placeholder="Commit message"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          className="w-full mt-4 p-3 bg-[#0d1117] border rounded text-white"
        />

        <button
          onClick={createCommit}
          className="mt-4 bg-green-600 px-5 py-2 rounded"
        >
          Commit
        </button>
      </div>
      {/* Commit History */}

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
    </div>
  );
}

export default RepositoryPage;
