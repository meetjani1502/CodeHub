import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import API from "../api/axios";

function FollowList() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine type from URL path (/followers or /following)
  const type = location.pathname.includes("following")
    ? "following"
    : "followers";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchList();
  }, [id, type]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const url = id ? `/user/${type}/${id}` : `/user/${type}`;
      const res = await API.get(url);
      setUsers(res.data.data || []);
    } catch (error) {
      console.log("FOLLOW LIST ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUser) => {
    setActionLoadingId(targetUser.id);
    try {
      if (targetUser.isFollowing) {
        await API.delete(`/user/follow/${targetUser.id}`);
      } else {
        await API.post(`/user/follow/${targetUser.id}`);
      }
      await fetchList();
    } catch (error) {
      console.log(
        "FOLLOW TOGGLE ERROR:",
        error.response?.data || error.message,
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8 max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 capitalize">{type}</h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400">
              {type === "followers"
                ? "No followers yet."
                : "Not following anyone yet."}
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center justify-between"
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

                  {!u.isSelf && (
                    <button
                      onClick={() => handleFollowToggle(u)}
                      disabled={actionLoadingId === u.id}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
                        u.isFollowing
                          ? "border border-[#30363d] hover:bg-red-900 hover:border-red-700 hover:text-red-200"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {u.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowList;
