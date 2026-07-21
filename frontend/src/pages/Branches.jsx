import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import API from "../api/axios";

function Branches() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBranches = async () => {
    try {
      const response = await API.get(`/branches/all`);

      console.log("BRANCH RESPONSE:", response.data);

      setBranches(response.data.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBranches();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Branches</h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : branches.length === 0 ? (
            <p className="text-gray-400">No branches found</p>
          ) : (
            branches.map((branch) => (
              <div
                key={branch.id}
                onClick={() => navigate(`/repository/${branch.repositoryId}`)}
                className="
                  bg-[#161b22]
                  border
                  border-[#30363d]
                  p-5
                  rounded-lg
                  mb-4
                  cursor-pointer
                  hover:bg-[#21262d]
                  transition
                  "
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl">🌿 {branch.name}</h2>
                  <span className="text-sm text-blue-400">
                    {branch.repository?.name || "Unknown Repository"}
                  </span>
                </div>

                <p className="text-gray-400 mt-1">Branch ID: {branch.id}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Branches;
