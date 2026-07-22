import { useEffect, useRef, useState } from "react";
import { FaBell, FaPlus } from "react-icons/fa6";
import {
  FaUser,
  FaFolderOpen,
  FaStar,
  FaCompass,
  FaGear,
  FaRightFromBracket,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/repositories?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const getInitial = () => {
    if (!user) return "U";
    const name = user.username || user.email || "U";
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    //reset the searchTerm
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    const id = params.get("id");

    setSearchTerm(search ?? "");
    console.log({ search, id });
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("user");

    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-8 relative">
      <input
        type="text"
        placeholder="Search repositories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
        className="w-96 bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 text-white"
      />

      <div className="flex items-center gap-5">
        <Link
          to="/create-repository"
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus />
          New
        </Link>

        <FaBell className="text-xl cursor-pointer" />

        {/* Avatar + Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-semibold"
          >
            {getInitial()}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden z-50">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-[#30363d]">
                <p className="text-sm font-semibold text-white">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>

              <div className="py-2">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white transition"
                >
                  <FaUser /> Your profile
                </Link>

                <Link
                  to="/repositories"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white transition"
                >
                  <FaFolderOpen /> Your repositories
                </Link>

                <Link
                  to="/repositories?filter=starred"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white transition"
                >
                  <FaStar /> Your stars
                </Link>

                <Link
                  to="/explore"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white transition"
                >
                  <FaCompass /> Explore
                </Link>
              </div>

              <div className="border-t border-[#30363d] py-2">
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white transition"
                >
                  <FaGear /> Settings
                </Link>
              </div>

              <div className="border-t border-[#30363d] py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white transition text-left"
                >
                  <FaRightFromBracket /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
