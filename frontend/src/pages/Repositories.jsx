import { useEffect, useState } from "react";
import API from "../api/axios";
import RepositoryCard from "../components/dashboard/RepositoryCard";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Repositories() {
    const [repositories, setRepositories] = useState([]);

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

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
                <Navbar />

                <div className="p-8">
                    <h1 className="text-3xl font-bold">My Repositories</h1>

                    <div className="mt-8 space-y-5">
                        {repositories.map((repo) => (
                            <RepositoryCard
                                key={repo.id}
                                repository={repo}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Repositories;