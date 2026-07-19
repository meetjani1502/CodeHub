import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function PullRequests() {
  const { id } = useParams();

  const [prs, setPrs] = useState([]);

  const getPRs = async () => {
    try {
      const response = await API.get(`/pullrequests/repository/${id}`);

      setPrs(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPRs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Pull Requests</h1>

      {prs.length === 0 ? (
        <p className="text-gray-400">No Pull Requests</p>
      ) : (
        prs.map((pr) => (
          <div
            key={pr.id}
            className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-5"
          >
            <h2 className="text-2xl font-bold">{pr.title}</h2>

            <p className="text-gray-400 mt-2">{pr.description}</p>

            <div className="mt-4">
              <span className="bg-green-600 px-3 py-1 rounded">
                {pr.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PullRequests;
