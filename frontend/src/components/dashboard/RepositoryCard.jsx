import { FaCodeBranch, FaRegStar, FaStar, FaCodeFork } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useState } from "react";

function RepositoryCard({ repository }) {
  const navigate = useNavigate();

  const [starred, setStarred] = useState(
    repository.stars && repository.stars.length > 0,
  );

  const [starCount, setStarCount] = useState(repository._count?.stars || 0);
  const [forkCount, setForkCount] = useState(repository._count?.fork || 0);
  const [forking, setForking] = useState(false);

  const handleStar = async (e) => {
    e.stopPropagation();

    try {
      if (starred) {
        await API.delete(`/repositories/${repository.id}/star`);

        setStarred(false);
        setStarCount((prev) => Math.max(prev - 1, 0));
      } else {
        await API.post(`/repositories/${repository.id}/star`);

        setStarred(true);
        setStarCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log("STAR ERROR:", error.response?.data || error.message);
    }
  };

  const handleFork = async (e) => {
    e.stopPropagation();

    if (forking) return;

    try {
      setForking(true);

      const response = await API.post(`/repositories/${repository.id}/fork`);

      setForkCount((prev) => prev + 1);

      alert("Repository forked successfully!");

      navigate(`/repository/${response.data.repository.id}`);
    } catch (error) {
      console.log("FORK ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Fork failed");
    } finally {
      setForking(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/repository/${repository.id}`)}
      className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-blue-500 transition duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-blue-400 hover:underline">
            {repository.name}
          </h2>

          <p className="text-gray-400 mt-2">{repository.description}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleStar}
            className="flex items-center gap-2 border border-[#30363d] rounded-md px-3 py-1 hover:bg-[#21262d]"
          >
            {starred ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
            <span>{starCount}</span>
          </button>

          <button
            onClick={handleFork}
            disabled={forking}
            className="flex items-center gap-2 border border-[#30363d] rounded-md px-3 py-1 hover:bg-[#21262d] disabled:opacity-50"
          >
            <FaCodeFork className="text-gray-400" />
            <span>{forkCount}</span>
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

        <span>Updated today</span>
      </div>
    </div>
  );
}

export default RepositoryCard;
