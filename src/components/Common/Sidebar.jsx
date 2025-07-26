import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  Users,
  FolderOpen,
  Settings,
  MessageSquare,
  Upload,
  BarChart,
  LogOut,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Define navigation items based on user role
  const isAdmin = user?.role === "admin";

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      showFor: ["admin", "client"],
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FolderOpen className="w-5 h-5" />,
      showFor: ["admin", "client"],
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: <MessageSquare className="w-5 h-5" />,
      showFor: ["admin", "client"],
    },
    {
      name: "Upload Files",
      path: "/upload",
      icon: <Upload className="w-5 h-5" />,
      showFor: ["admin"],
    },
    {
      name: "Clients",
      path: "/clients",
      icon: <Users className="w-5 h-5" />,
      showFor: ["admin"],
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart className="w-5 h-5" />,
      showFor: ["admin"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
      showFor: ["admin", "client"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;
    return item.showFor.includes(user.role);
  });

  return (
    <div className="bg-indigo-800 text-white w-64 min-h-screen p-4 hidden md:block">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">
          {isAdmin ? "Rivong Admin" : "Client Portal"}
        </h2>
        {/* <div className="px-4 py-3 bg-indigo-700 rounded-lg mb-6">
          <p className="text-sm opacity-75">Logged in as</p>
          <p className="font-semibold">{user?.name || 'User'}</p>
          <p className="text-xs opacity-75">{user?.email}</p>
        </div> */}
      </div>

      <nav>
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="absolute bottom-28 left-0 w-56 ml-4 p-4 flex items-center space-x-3 rounded-lg text-indigo-100 hover:bg-indigo-600"
      >
        <LogOut className="h-5 w-5 text-w" />
        <span className="">Logout</span>
      </button>

      <div className="absolute bottom-0 left-0 w-64 p-4">
        <div className="border-t border-indigo-700 pt-4">
          <p className="text-xs text-indigo-300 text-center">
            Rivong Feedback System
            <br />
            &copy; {new Date().getFullYear()} Rivong
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
