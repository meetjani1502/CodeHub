import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import RepositoryCard from "../components/dashboard/RepositoryCard";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const res = await API.get("/repositories");
      setRepositories(res.data.repositories);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredRepositories = searchQuery
    ? repositories.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : repositories;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold">My Repositories</h1>

          {searchQuery && (
            <p className="text-gray-400 mt-2">
              Showing results for:{" "}
              <span className="text-blue-400 font-semibold">
                "{searchQuery}"
              </span>{" "}
              ({filteredRepositories.length} found)
            </p>
          )}

          <div className="mt-8 space-y-5">
            {filteredRepositories.length === 0 ? (
              <p className="text-gray-400">No repositories found</p>
            ) : (
              filteredRepositories.map((repo) => (
                <RepositoryCard key={repo.id} repository={repo} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Repositories;
