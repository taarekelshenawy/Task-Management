import { Link } from 'react-router-dom';
import { useState } from 'react';
import SignUpIcon from '../../assets/Icon.svg';
import { logoutFunction } from '../../services/authService';

import {
  FolderKanban,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function handleLogout() {
    logoutFunction();
  }

  return (
    <>
      {/* زرار الموبايل (Menu Icon) */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white shadow rounded"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-50  bg-[#F1F3FF]
          flex flex-col transition-transform duration-300  min-h-screen
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top */}
        <div className="flex items-center justify-between px-4 py-8">
          <div className="flex items-center gap-2 font-bold">
            <img src={SignUpIcon} alt="Logo" />
            {!collapsed && <h1 className="text-[#041B3C] text-xl">TASKLY</h1>}
          </div>

          {/* close button (mobile only) */}
          <button className="lg:hidden" onClick={() => setIsMobileOpen(false)}>
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
              to="epics"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
         
              {!collapsed && <span>Project Tasks</span>}
            </Link>
          </li>
            {/* <li>
              <Link
                to="/project/epics"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Flag size={20} />
                {!collapsed && <span>Project Epics</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/projects/tasks"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <ListTodo size={20} />
                {!collapsed && <span>Project Tasks</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/project/members"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Users size={20} />
                {!collapsed && <span>Project Members</span>}
              </Link>
            </li> */}

            {/* <li>
              <Link
                to="/project/details"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              >
                <Info size={20} />
                {!collapsed && <span>Project Details</span>}
              </Link>
            </li> */}
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
              className={`${collapsed ? 'rotate-180' : ''}`}
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
    </>
  );
}

// import { Link } from "react-router-dom";
// import { useState } from "react";
// import SignUpIcon from "../../assets/Icon.svg";
// import { logoutFunction } from "../../services/authService";

// import {
//   FolderKanban,
//   ListTodo,
//   Users,
//   Info,
//   Flag,
//   ChevronLeft,
//   LogOut,
// } from "lucide-react";

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   function handleLogout() {
//     logoutFunction();
//   }

//   return (
//     <>
//       {/* Overlay (Mobile only) */}
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 lg:hidden z-40"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed lg:static top-0 left-0 z-50 h-screen bg-[#F1F3FF]
//           flex flex-col transition-all duration-300
//           ${collapsed ? "w-20" : "w-64"}
//           ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//       >
//         {/* Top */}
//         <div className="flex items-center justify-between px-4 py-8">
//           <div className="flex items-center gap-2 font-bold">
//             <img src={SignUpIcon} alt="Logo" />
//             {!collapsed && (
//               <h1 className="text-[#041B3C] text-xl">TASKLY</h1>
//             )}
//           </div>

//           {/* close button mobile */}
//           <button
//             className="lg:hidden text-xl"
//             onClick={() => setIsMobileOpen(false)}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 p-4 font-semibold">
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/projects"
//                 onClick={() => setIsMobileOpen(false)}
//                 className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
//               >
//                 <FolderKanban size={20} />
//                 {!collapsed && <span>Projects</span>}
//               </Link>
//             </li>

//             <li>
//               <Link
//                 to="/projects/epics"
//                 onClick={() => setIsMobileOpen(false)}
//                 className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
//               >
//                 <Flag size={20} />
//                 {!collapsed && <span>Project Epics</span>}
//               </Link>
//             </li>

//             <li>
//               <Link
//                 to="/projects/tasks"
//                 onClick={() => setIsMobileOpen(false)}
//                 className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
//               >
//                 <ListTodo size={20} />
//                 {!collapsed && <span>Project Tasks</span>}
//               </Link>
//             </li>

//             <li>
//               <Link
//                 to="/projects/members"
//                 onClick={() => setIsMobileOpen(false)}
//                 className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
//               >
//                 <Users size={20} />
//                 {!collapsed && <span>Project Members</span>}
//               </Link>
//             </li>

//             <li>
//               <Link
//                 to="/projects/details"
//                 onClick={() => setIsMobileOpen(false)}
//                 className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
//               >
//                 <Info size={20} />
//                 {!collapsed && <span>Project Details</span>}
//               </Link>
//             </li>
//           </ul>
//         </nav>

//         {/* Bottom */}
//         <div className="p-4 space-y-2">
//           {/* Collapse (desktop only) */}
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className="hidden lg:flex w-full items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
//           >
//             <ChevronLeft
//               size={20}
//               className={`${collapsed ? "rotate-180" : ""}`}
//             />
//             {!collapsed && <span>Collapse</span>}
//           </button>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
//           >
//             <LogOut size={20} />
//             {!collapsed && <span>Logout</span>}
//           </button>

//           {/* Open sidebar button (mobile only) */}
//           <button
//             className="lg:hidden w-full p-3 bg-primary text-white rounded-lg"
//             onClick={() => setIsMobileOpen(true)}
//           >
//             Open Menu
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import SignUpIcon from '../../assets/Icon.svg';
// import { logoutFunction } from '../../services/authService';

// import {
//   FolderKanban,
//   ListTodo,
//   Users,
//   Info,
//   Flag,
//   ChevronLeft,
//   LogOut,
// } from 'lucide-react';

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [openMenu,setOpenMenu]=useState(false);
//   const [isMobile,setIsMobile]=useState(false);

//   window.addEventListener(('resize',()=>{

//   }))

//   function handleLogout() {
//     logoutFunction();
//   }

//   return (
//     <aside
//       className={`h-screen bg-[#F1F3FF] flex flex-col transition-all duration-300 ${
//         collapsed ? 'w-20' : 'w-64'
//       }`}
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-2 font-bold px-4 py-8">
//         <img src={SignUpIcon} alt="Logo" />

//         {!collapsed && <h1 className="text-[#041B3C] text-xl">TASKLY</h1>}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 font-semibold">
//         <ul className="space-y-2">
//           <li>
//             <Link
//               to="/projects"
//               className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
//             >
//               <FolderKanban size={20} />
//               {!collapsed && <span>Projects</span>}
//             </Link>
//           </li>

//           <li>
//             <Link
//               to="/projects/epics"
//               className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
//             >
//               <Flag size={20} />
//               {!collapsed && <span>Project Epics</span>}
//             </Link>
//           </li>

//           <li>
//             <Link
//               to="/projects/tasks"
//               className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
//             >
//               <ListTodo size={20} />
//               {!collapsed && <span>Project Tasks</span>}
//             </Link>
//           </li>

//           <li>
//             <Link
//               to="/projects/members"
//               className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
//             >
//               <Users size={20} />
//               {!collapsed && <span>Project Members</span>}
//             </Link>
//           </li>

//           <li>
//             <Link
//               to="/projects/details"
//               className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
//             >
//               <Info size={20} />
//               {!collapsed && <span>Project Details</span>}
//             </Link>
//           </li>
//         </ul>
//       </nav>

//       {/* Bottom Actions */}
//       <div className="p-4 space-y-2">
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 font-bold text-[#041B3C] transition"
//         >
//           <ChevronLeft
//             size={20}
//             className={`transition-transform duration-300 ${
//               collapsed ? 'rotate-180' : ''
//             }`}
//           />

//           {!collapsed && <span>Collapse</span>}
//         </button>

//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
//         >
//           <LogOut size={20} />

//           {!collapsed && <span>Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }
