import { Link } from "react-router-dom";
import SignUpIcon from "../../assets/Icon.svg";
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
  return (
    <aside className="w-64 h-screen bg-[#F1F3FF] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold px-10 py-8 ">
        <img src={SignUpIcon} />
        <h1 className="text-[#041B3C] text-xl">TASKLY</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 font-semibold">
        <ul className="space-y-2">
          <li>
            <Link
              to="/projects"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <FolderKanban size={20} />
              <span>Projects</span>
            </Link>
          </li>

          <li>
            <Link
              to="/projects/epics"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <Flag size={20} />
              <span>Project Epics</span>
            </Link>
          </li>

          <li>
            <Link
              to="/projects/tasks"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <ListTodo size={20} />
              <span>Project Tasks</span>
            </Link>
          </li>

          <li>
            <Link
              to="/projects/members"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <Users size={20} />
              <span>Project Members</span>
            </Link>
          </li>

          <li>
            <Link
              to="/projects/details"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <Info size={20} />
              <span>Project Details</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className=" p-4 space-y-2">
        <button
          className=" font-bold text-[#041B3C] w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
          <span>Collapse</span>
        </button>

        <button
          className="w-full flex items-center font-semibold gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}