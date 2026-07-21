import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import API from "../api/axios";

function Commits() {
  const navigate = useNavigate();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCommits = async () => {
    try {
      const response = await API.get(`/commits/all`);
      setCommits(response.data.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommits();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Commits</h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : commits.length === 0 ? (
            <p className="text-gray-400">No commits found</p>
          ) : (
            commits.map((commit) => (
              <div
                key={commit.id}
                onClick={() => navigate(`/repository/${commit.repositoryId}`)}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 mb-4 cursor-pointer hover:bg-[#21262d] transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">📝 {commit.message}</h2>
                  <span className="text-sm text-blue-400">
                    {commit.repository?.name || "Unknown Repository"}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mt-2">
                  Branch: {commit.branch?.name || "N/A"}
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  {new Date(commit.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Commits;
