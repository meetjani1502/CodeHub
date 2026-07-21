import {
  FaHouse,
  FaCodeBranch,
  FaFolderOpen,
  FaGear,
  FaCode,
  FaCodeMerge,
  FaCompass,
} from "react-icons/fa6";

import { Link } from "react-router-dom";

function Sidebar() {
  const menus = [
    {
      name: "Dashboard",
      icon: <FaHouse />,
      path: "/dashboard",
    },

    {
      name: "Repositories",
      icon: <FaFolderOpen />,
      path: "/repositories",
    },

    {
      name: "Branches",
      icon: <FaCodeBranch />,
      path: "/branches",
    },

    {
      name: "Pull Requests",
      icon: <FaCodeMerge />,
      path: "/pullrequests",
    },

    {
      name: "Commits",
      icon: <FaGear />,
      path: "/commits",
    },

    {
      name: "Settings",
      icon: <FaGear />,
      path: "/settings",
    },
    {
      name: "Explore",
      icon: <FaCompass />,
      path: "/explore",
    },
  ];

  return (
    <aside className="w-64 bg-[#161b22] border-r border-[#30363d] min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">🚀 CodeHub</h1>
      </div>

      <nav>
        {menus.map((menu) => (
          <Link
            key={menu.name}
            to={menu.path}
            className="flex items-center gap-3 px-6 py-4 hover:bg-[#21262d] transition"
          >
            {menu.icon}

            {menu.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
