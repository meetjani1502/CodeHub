import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import StatusBadge from "../components/common/StatusBadge";
import API from "../api/axios";

function Issues() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await API.get("/issues/all");
      setIssues(res.data.data || []);
    } catch (error) {
      console.log("ISSUES FETCH ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Issues</h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : issues.length === 0 ? (
            <p className="text-gray-400">No issues found</p>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => navigate(`/repository/${issue.repositoryId}`)}
                  className="gh-card p-5 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">{issue.title}</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {issue.description}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        #{issue.id} opened by{" "}
                        {issue.author?.username || issue.author?.email} in{" "}
                        <span className="text-blue-400">
                          {issue.repository?.name}
                        </span>
                      </p>
                    </div>

                    <StatusBadge status={issue.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Issues;
