import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { FaUser, FaShieldHalved, FaSliders } from "react-icons/fa6";

function Settings() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-[#0d1117] min-h-screen text-white">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-3">Settings</h1>

          <p className="text-gray-400 mb-10">
            Manage your account settings, profile information, security
            preferences, and application options.
          </p>

          <div className="space-y-5">
            {/* Profile Section */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaUser className="text-blue-400" />
                <h2 className="text-xl font-bold">Profile Information</h2>
              </div>
              <p className="text-gray-400 text-sm">
                Update your username, email, and other profile details.
              </p>
            </div>

            {/* Security Section */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaShieldHalved className="text-green-400" />
                <h2 className="text-xl font-bold">Security</h2>
              </div>
              <p className="text-gray-400 text-sm">
                Change your password and manage security preferences.
              </p>
            </div>

            {/* Application Options Section */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaSliders className="text-purple-400" />
                <h2 className="text-xl font-bold">Application Options</h2>
              </div>
              <p className="text-gray-400 text-sm">
                Customize your CodeHub experience and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
