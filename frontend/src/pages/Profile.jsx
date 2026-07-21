import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCodeBranch, FaStar } from "react-icons/fa6";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import API from "../api/axios";

function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const url = id ? `/user/profile/${id}` : "/user/profile";
      const res = await API.get(url);
      setData(res.data);
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!id || followLoading) return;

    setFollowLoading(true);
    try {
      if (data.isFollowing) {
        await API.delete(`/user/follow/${id}`);
      } else {
        await API.post(`/user/follow/${id}`);
      }
      await fetchProfile();
    } catch (error) {
      console.log("FOLLOW ERROR:", error.response?.data || error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  // Build 365-day grid (like GitHub contribution graph)
  const buildContributionGrid = () => {
    if (!data) return [];

    const today = new Date();
    const days = [];

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];

      days.push({
        date: key,
        count: data.contributions[key] || 0,
      });
    }

    const weeks = [];
    let currentWeek = [];

    const firstDay = new Date(days[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const getColor = (count) => {
    if (!count || count === 0) return "bg-[#161b22] border border-[#30363d]";
    if (count === 1) return "bg-green-900";
    if (count === 2) return "bg-green-700";
    if (count === 3) return "bg-green-500";
    return "bg-green-400";
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
          <Navbar />
          <div className="p-8 text-gray-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
          <Navbar />
          <div className="p-8 text-gray-400">Failed to load profile.</div>
        </div>
      </div>
    );
  }

  const weeks = buildContributionGrid();
  const isOwnProfile = data.isOwnProfile !== false && !id;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8 flex gap-10">
          {/* Left column - profile card */}
          <div className="w-72 shrink-0">
            <div className="w-40 h-40 rounded-full bg-green-600 flex items-center justify-center text-5xl font-bold mb-4">
              {(data.user.username || data.user.email).charAt(0).toUpperCase()}
            </div>

            <h1 className="text-2xl font-bold">
              {data.user.username || "Unnamed User"}
            </h1>
            <p className="text-gray-400">{data.user.email}</p>

            {isOwnProfile ? (
              <button
                onClick={() => navigate("/settings")}
                className="w-full mt-4 border border-[#30363d] rounded-lg py-1.5 hover:bg-[#161b22] transition"
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`w-full mt-4 rounded-lg py-1.5 font-semibold transition disabled:opacity-50 ${
                  data.isFollowing
                    ? "border border-[#30363d] hover:bg-red-900 hover:border-red-700 hover:text-red-200"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {data.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}

            <div className="flex gap-4 mt-4 text-sm text-gray-400">
              <span
                onClick={() =>
                  navigate(
                    id ? `/profile/${id}/followers` : `/profile/followers`,
                  )
                }
                className="cursor-pointer hover:underline"
              >
                <span className="text-white font-semibold">
                  {data.followersCount}
                </span>{" "}
                followers
              </span>
              <span>·</span>
              <span
                onClick={() =>
                  navigate(
                    id ? `/profile/${id}/following` : `/profile/following`,
                  )
                }
                className="cursor-pointer hover:underline"
              >
                <span className="text-white font-semibold">
                  {data.followingCount}
                </span>{" "}
                following
              </span>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-400 border-t border-[#30363d] pt-4">
              <p className="flex items-center gap-2">
                <FaCodeBranch /> {data.repoCount} repositories
              </p>
              <p className="flex items-center gap-2">
                <FaStar /> {data.totalStars} stars earned
              </p>
            </div>
          </div>

          {/* Right column - repos, graph, activity */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold mb-4">Popular repositories</h2>

            {data.popularRepos.length === 0 ? (
              <p className="text-gray-400 mb-8">No repositories yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-10">
                {data.popularRepos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => navigate(`/repository/${repo.id}`)}
                    className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-blue-400 font-semibold hover:underline">
                        {repo.name}
                      </h3>
                      <span className="text-xs border border-[#30363d] rounded-full px-2 py-0.5 text-gray-400">
                        Public
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                      {repo.description || "No description"}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                      <FaStar className="text-yellow-400" />
                      {repo._count?.stars || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-lg font-bold mb-4">
              {data.totalContributions} contributions in the last year
            </h2>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 mb-10 overflow-x-auto">
              <div className="flex gap-1">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) =>
                      day ? (
                        <div
                          key={di}
                          title={`${day.date}: ${day.count} contribution(s)`}
                          className={`w-3 h-3 rounded-sm ${getColor(
                            day.count,
                          )}`}
                        />
                      ) : (
                        <div key={di} className="w-3 h-3" />
                      ),
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 justify-end">
                Less
                <div className="w-3 h-3 rounded-sm bg-[#161b22] border border-[#30363d]" />
                <div className="w-3 h-3 rounded-sm bg-green-900" />
                <div className="w-3 h-3 rounded-sm bg-green-700" />
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <div className="w-3 h-3 rounded-sm bg-green-400" />
                More
              </div>
            </div>

            <h2 className="text-lg font-bold mb-4">Recent activity</h2>

            {data.activity.length === 0 ? (
              <p className="text-gray-400">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {data.activity.map((item, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      item.repositoryId &&
                      navigate(`/repository/${item.repositoryId}`)
                    }
                    className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:bg-[#21262d] transition"
                  >
                    <p className="text-sm">
                      {item.type === "REPO_CREATED" ? "📦 " : "📝 "}
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
