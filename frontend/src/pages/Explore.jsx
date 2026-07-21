import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaCodeFork, FaCodeBranch } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function Explore() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const res = await API.get("/repositories/explore/all");
      setRepositories(res.data.repositories || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async (e, repo) => {
    e.stopPropagation();

    const isStarred = repo.stars && repo.stars.length > 0;

    try {
      if (isStarred) {
        await API.delete(`/repositories/${repo.id}/star`);
      } else {
        await API.post(`/repositories/${repo.id}/star`);
      }

      fetchRepositories();
    } catch (error) {
      console.log("STAR ERROR:", error.response?.data || error.message);
    }
  };

  const handleFork = async (e, repo) => {
    e.stopPropagation();

    try {
      const response = await API.post(`/repositories/${repo.id}/fork`);

      alert("Repository forked successfully!");

      navigate(`/repository/${response.data.repository.id}`);
    } catch (error) {
      console.log("FORK ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Fork failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-1">Explore Repositories</h1>
          <p className="text-gray-400 mb-8">
            Discover repositories created by other users.
          </p>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : repositories.length === 0 ? (
            <p className="text-gray-400">
              No repositories from other users found.
            </p>
          ) : (
            <div className="space-y-5">
              {repositories.map((repo) => {
                const isStarred = repo.stars && repo.stars.length > 0;

                return (
                  <div
                    key={repo.id}
                    onClick={() => navigate(`/repository/${repo.id}`)}
                    className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-blue-500 transition duration-300 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold text-blue-400 hover:underline">
                            {repo.name}
                          </h2>
                          <span className="text-gray-500 text-sm">
                            by {repo.owner?.username || repo.owner?.email}
                          </span>
                        </div>

                        <p className="text-gray-400 mt-2">{repo.description}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={(e) => handleStar(e, repo)}
                          className="flex items-center gap-2 border border-[#30363d] rounded-md px-3 py-1 hover:bg-[#21262d]"
                        >
                          {isStarred ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-gray-400" />
                          )}
                          <span>{repo._count?.stars || 0}</span>
                        </button>

                        <button
                          onClick={(e) => handleFork(e, repo)}
                          className="flex items-center gap-2 border border-[#30363d] rounded-md px-3 py-1 hover:bg-[#21262d]"
                        >
                          <FaCodeFork className="text-gray-400" />
                          <span>{repo._count?.fork || 0}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-6 mt-6 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        JavaScript
                      </span>

                      <span className="flex items-center gap-2">
                        <FaCodeBranch />
                        main
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;
