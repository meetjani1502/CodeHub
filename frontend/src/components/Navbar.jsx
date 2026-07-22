import { Link } from "react-router-dom";
import { FaPlus, FaBell } from "react-icons/fa";

function Navbar() {
  return (
    <header className="h-16 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-white">CodeHub</h1>

      <div className="flex items-center gap-5">
        <Link
          to="/create-repository"
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus />
          New
        </Link>

        <FaBell className="text-white text-xl cursor-pointer" />

        <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white">
          Profile
        </button>
      </div>
    </header>
  );
}

export default Navbar;
