import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import API from "../api/axios";

function PullRequests() {
  const navigate = useNavigate();
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPRs = async () => {
    try {
      const response = await API.get(`/pullrequests/all`);
      setPrs(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPRs();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Pull Requests</h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : prs.length === 0 ? (
            <p className="text-gray-400">No Pull Requests</p>
          ) : (
            prs.map((pr) => {
              const repoId =
                pr.targetBranch?.repository?.id ||
                pr.sourceBranch?.repository?.id;
              const repoName =
                pr.targetBranch?.repository?.name ||
                pr.sourceBranch?.repository?.name ||
                "Unknown Repository";

              return (
                <div
                  key={pr.id}
                  onClick={() => navigate(`/repository/${repoId}/pullrequests`)}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-5 cursor-pointer hover:bg-[#21262d] transition"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{pr.title}</h2>
                    <span className="text-sm text-blue-400">{repoName}</span>
                  </div>

                  <p className="text-gray-400 mt-2">{pr.description}</p>

                  <div className="mt-4">
                    <span className="bg-green-600 px-3 py-1 rounded">
                      {pr.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PullRequests;
