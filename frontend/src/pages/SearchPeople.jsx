import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import API from "../api/axios";

function SearchPeople() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await API.get(
        `/user/search?q=${encodeURIComponent(query.trim())}`,
      );
      setUsers(res.data.data || []);
    } catch (error) {
      console.log(
        "SEARCH PEOPLE ERROR:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUser) => {
    try {
      if (targetUser.isFollowing) {
        await API.delete(`/user/follow/${targetUser.id}`);
      } else {
        await API.post(`/user/follow/${targetUser.id}`);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, isFollowing: !u.isFollowing } : u,
        ),
      );
    } catch (error) {
      console.log(
        "FOLLOW TOGGLE ERROR:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8 max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Search People</h1>

          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          {loading ? (
            <p className="text-gray-400">Searching...</p>
          ) : !searched ? (
            <p className="text-gray-400">
              Enter a username or email to find people on CodeHub.
            </p>
          ) : users.length === 0 ? (
            <p className="text-gray-400">No users found for "{query}".</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="gh-card p-4 flex items-center justify-between"
                >
                  <div
                    onClick={() => navigate(`/profile/${u.id}`)}
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center font-bold text-lg">
                      {(u.username || u.email).charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold hover:underline">
                        {u.username || "Unnamed User"}
                      </p>
                      <p className="text-gray-400 text-sm">{u.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFollowToggle(u)}
                    className={u.isFollowing ? "btn-secondary" : "btn-primary"}
                  >
                    {u.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPeople;
