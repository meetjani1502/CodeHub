import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import RepositoryCard from "../components/dashboard/RepositoryCard";
import { useEffect, useState } from "react";
import api from "../api/axios";
function Dashboard() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/repositories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      setRepositories(response.data.repositories);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        {/* Top Navbar */}
        <Navbar />

        {/* Dashboard Body */}
        <div className="p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome to CodeHub</h1>

              <p className="text-gray-400 mt-2">
                Manage all your repositories in one place.
              </p>
            </div>
          </div>

          {/* Repository List */}
          <div className="mt-10 space-y-5">
            {repositories.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
