import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Repositories",
      path: "/repositories",
    },
    {
      name: "Create Repository",
      path: "/repositories/create",
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#161b22] text-white p-5">
      {/* Logo */}

      <h1 className="text-2xl font-bold mb-8">CodeHub 🚀</h1>

      {/* Menu */}

      <nav className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`
                block px-4 py-2 rounded-lg
                ${
                  location.pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }
              `}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
