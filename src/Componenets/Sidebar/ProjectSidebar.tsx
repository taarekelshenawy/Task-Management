import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import SignUpIcon from "../../assets/Icon.svg";
import { logoutFunction } from "../../services/authService";

import {
  FolderKanban,
  ListTodo,
  Users,
  Info,
  Flag,
  ChevronLeft,
  LogOut,

  X,
} from "lucide-react";

export default function ProjectSidebar() {
const [collapsed, setCollapsed] = useState(false);
const [isMobileOpen, setIsMobileOpen] = useState(false);

const {projectId}=useParams();



  function handleLogout() {
    logoutFunction();
  }

  return (
    
        <aside
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-50  bg-[#F1F3FF]
          flex flex-col transition-transform duration-300
          min-h-screen
          ${collapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top */}
        <div className="flex items-center justify-between px-4 py-8">
          <div className="flex items-center gap-2 font-bold">
            <img src={SignUpIcon} alt="Logo" />
            {!collapsed && (
              <h1 className="text-[#041B3C] text-xl">TASKLY</h1>
            )}
          </div>

          {/* close button (mobile only) */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 font-semibold">
          <ul className="space-y-2">
            <li>
              <Link
                to="/project"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <FolderKanban size={20} />
                {!collapsed && <span>Projects</span>}
              </Link>
            </li>

            <li>
              <Link
                to='epics'
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Flag size={20} />
                {!collapsed && <span>Project Epics</span>}
              </Link>
            </li>

            <li>
              <Link
               to="tasks"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <ListTodo size={20} />
                {!collapsed && <span>Project Tasks</span>}
              </Link>
            </li>

            <li>
              <Link
              to="members"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Users size={20} />
                {!collapsed && <span>Project Members</span>}
              </Link>
            </li>

            <li>
              <Link
               to="edit"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Info size={20} />
                {!collapsed && <span>Project Details</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom */}
        <div className="p-4 space-y-2">
          {/* Collapse (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft
              size={20}
              className={`${collapsed ? "rotate-180" : ""}`}
            />
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

     
  )
}
