import { FaCodeBranch, FaRegStar, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useState } from "react";

function RepositoryCard({ repository }) {
  const navigate = useNavigate();

  const [starred, setStarred] = useState(false);

  const [starCount, setStarCount] = useState(repository._count?.stars || 0);

  const handleStar = async (e) => {
    e.stopPropagation();

    try {
      if (starred) {
        // Remove Star
        await API.delete(`/repositories/${repository.id}/star`);

        setStarred(false);
        setStarCount((prev) => Math.max(prev - 1, 0));
      } else {
        // Add Star
        await API.post(`/repositories/${repository.id}/star`);

        setStarred(true);
        setStarCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log("STAR ERROR:", error.response?.data || error.message);
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

        <button
          onClick={handleStar}
          className="flex items-center gap-2 border border-[#30363d] rounded-md px-3 py-1 hover:bg-[#21262d]"
        >
          <FaRegStar
            className={starred ? "text-yellow-400" : "text-gray-400"}
          />

          <span>{starCount}</span>
        </button>
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
