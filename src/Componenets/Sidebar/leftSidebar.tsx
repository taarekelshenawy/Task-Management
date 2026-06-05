import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SignUpIcon from "../../assets/Icon.svg";
import { useAppDispatch } from "../../Store/hooks";
import { logoutLocal } from "../../Store/Auth/AuthSlice";

import {
  FolderKanban,
  ListTodo,
  Users,
  Info,
  Flag,
  ChevronLeft,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  function SignOut() {
    dispatch(logoutLocal());
    navigate("/login");
  }

  return (
    <aside
      className={`h-screen bg-[#F1F3FF] flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold px-4 py-8">
        <img src={SignUpIcon} alt="Logo" />

        {!collapsed && (
          <h1 className="text-[#041B3C] text-xl">TASKLY</h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 font-semibold">
        <ul className="space-y-2">
          <li>
            <Link
              to="/projects"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <FolderKanban size={20} />
              {!collapsed && <span>Projects</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/projects/epics"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Flag size={20} />
              {!collapsed && <span>Project Epics</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/projects/tasks"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <ListTodo size={20} />
              {!collapsed && <span>Project Tasks</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/projects/members"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Users size={20} />
              {!collapsed && <span>Project Members</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/projects/details"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <Info size={20} />
              {!collapsed && <span>Project Details</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-bold text-[#041B3C] transition"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />

          {!collapsed && <span>Collapse</span>}
        </button>

        <button
          onClick={SignOut}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}














