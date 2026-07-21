import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useTheme } from "../context/ThemeContext";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaTriangleExclamation,
} from "react-icons/fa6";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useTheme();
  const tabs = [
    { id: "profile", name: "Public profile", icon: <FaUser /> },
    { id: "password", name: "Password and authentication", icon: <FaLock /> },
    { id: "notifications", name: "Notifications", icon: <FaBell /> },
    { id: "appearance", name: "Appearance", icon: <FaPalette /> },
    { id: "danger", name: "Danger Zone", icon: <FaTriangleExclamation /> },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-1">Settings</h1>
          <p className="text-gray-400 mb-8">
            Manage your account settings, profile information, security
            preferences, and application options.
          </p>

          <div className="flex gap-10">
            {/* Secondary sidebar (GitHub-style tabs) */}
            <div className="w-64 shrink-0 border-r border-[#30363d] pr-5">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition
                      ${
                        activeTab === tab.id
                          ? "bg-[#21262d] text-white font-semibold border-l-2 border-blue-500"
                          : "text-gray-400 hover:bg-[#161b22] hover:text-white"
                      }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content area */}
            <div className="flex-1 max-w-2xl">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-[#30363d] pb-4">
                    Public profile
                  </h2>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="your-username"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell us a little about yourself"
                      rows={3}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold">
                    Update profile
                  </button>
                </div>
              )}

              {activeTab === "password" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-[#30363d] pb-4">
                    Change password
                  </h2>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Current password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      New password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold">
                    Update password
                  </button>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-[#30363d] pb-4">
                    Notifications
                  </h2>

                  {[
                    "Email me when someone comments on my commits",
                    "Email me when a pull request is opened",
                    "Email me when a pull request is merged",
                    "Notify me about repository activity",
                  ].map((label, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-4"
                    >
                      <span className="text-gray-300">{label}</span>
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-green-600"
                        defaultChecked
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-[#30363d] pb-4">
                    Appearance
                  </h2>

                  <p className="text-gray-400 text-sm">
                    Choose how CodeHub looks to you.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => theme !== "dark" && toggleTheme()}
                      className={`rounded-lg p-4 bg-[#0d1117] cursor-pointer border-2 ${
                        theme === "dark"
                          ? "border-blue-500"
                          : "border-[#30363d]"
                      }`}
                    >
                      <div className="h-24 bg-[#161b22] rounded mb-3 border border-[#30363d]"></div>
                      <p className="text-center font-semibold text-white">
                        Dark {theme === "dark" && "(current)"}
                      </p>
                    </div>

                    <div
                      onClick={() => theme !== "light" && toggleTheme()}
                      className={`rounded-lg p-4 bg-white cursor-pointer border-2 ${
                        theme === "light"
                          ? "border-blue-500"
                          : "border-[#30363d]"
                      }`}
                    >
                      <div className="h-24 bg-gray-100 rounded mb-3 border border-gray-300"></div>
                      <p className="text-center font-semibold text-gray-800">
                        Light {theme === "light" && "(current)"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "danger" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b border-[#30363d] pb-4 text-red-500">
                    Danger Zone
                  </h2>

                  <div className="border border-red-900 rounded-lg p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Delete all repositories</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Once deleted, this cannot be undone.
                      </p>
                    </div>
                    <button className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-semibold">
                      Delete
                    </button>
                  </div>

                  <div className="border border-red-900 rounded-lg p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Delete account</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Permanently delete your account and all data.
                      </p>
                    </div>
                    <button className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-semibold">
                      Delete account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
