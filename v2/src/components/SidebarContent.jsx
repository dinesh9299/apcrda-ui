// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, MapPin } from "lucide-react";
// import logo from "../images/logob1.png";
// import logo1 from "../images/logob2.png";

// import { getUser, logout } from "../utils/auth";
// import { useNavigate } from "react-router-dom";
// import { Avatar } from "antd";
// import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

// const menu = [
//   { name: "Dashboard", path: "/", icon: LayoutDashboard },
//   { name: "Locations", path: "/locations", icon: MapPin },
// ];

// export default function SidebarContent({ collapsed, onItemClick }) {
//   const user = getUser();
//   const navigate = useNavigate();

//   return (
//     <div className="h-full flex flex-col">
//       {/* LOGO */}
//       {/* <div className={`h-28 flex items-center justify-center shadow-sm `}>
//         {!collapsed ? (
//           <img
//             // src="https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
//             src={logo}
//             className={`${collapsed ? "w-8" : "w-40"}`}
//           />
//         ) : (
//           <img
//             // src="https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
//             src={logo1}
//             className={`${collapsed ? "w-8" : "w-40"}`}
//           />
//         )}
//       </div> */}

//       <div className="h-28 flex items-center justify-center shadow-sm">
//         <img
//           src={collapsed ? logo1 : logo}
//           className={`transition-all duration-300 ${
//             collapsed ? "w-10" : "w-40"
//           }`}
//           alt="Logo"
//         />
//       </div>

//       {/* MENU */}
//       <nav className="flex-1 mt-4 space-y-1 px-2">
//         {menu.map((item) => {
//           const Icon = item.icon;
//           return (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/"}
//               onClick={onItemClick}
//               className={({ isActive }) =>
//                 `flex items-center rounded-xl transition
//     ${collapsed ? "justify-center px-0 py-3" : "justify-start px-4 py-3 gap-3"}
//     ${
//       isActive
//         ? "bg-white/40 text-black shadow-md"
//         : "text-slate-900 hover:bg-[#fbbf24]"
//     }`
//               }
//             >
//               {/* Wrap Icon in a fixed-width container or use min-width */}
//               <div className="flex items-center justify-center min-w-[20px]">
//                 <Icon size={22} strokeWidth={2.5} />
//               </div>

//               {!collapsed && <span>{item.name}</span>}
//             </NavLink>
//           );
//         })}
//       </nav>

//       {/* USER — BOTTOM */}
//       <div className="border-t border-slate-700 p-3 flex items-center gap-3">
//         <Avatar
//           icon={<UserOutlined />}
//           style={{ backgroundColor: "#1e40af" }}
//         />

//         {!collapsed && (
//           <div className="flex-1">
//             <div className="text-sm font-semibold text-white">
//               {user?.email || "User"}
//             </div>
//             <div className="text-xs text-slate-300">{user?.role?.name}</div>
//           </div>
//         )}

//         {!collapsed && (
//           <button
//             onClick={() => {
//               logout();
//               navigate("/login", { replace: true });
//             }}
//             className="text-slate-300 hover:text-white cursor-pointer transition"
//           >
//             <LogoutOutlined />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

import { NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, ClipboardCheck } from "lucide-react";
import logo from "../images/logob1.png";
import logo1 from "../images/logob2.png";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion"; // Add this
import { isAuthenticated, logout, getUser } from "../utils/auth";

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Locations", path: "/locations", icon: MapPin },
  { name: "Surveys", path: "/surveys", icon: ClipboardCheck },
];

export default function SidebarContent({ collapsed, onItemClick }) {
  const user = getUser();
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  return (
    <div className="h-full flex flex-col transition-all duration-300 ease-in-out">
      {/* LOGO SECTION - Animated centering */}
      {/* <div className="h-28 flex items-center justify-center shadow-sm overflow-hidden">
        <motion.img
          layout // Smoothly animates size changes
          initial={false}
          animate={{ width: collapsed ? 40 : 160 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          src={collapsed ? logo1 : logo}
          alt="Logo"
          className="object-contain"
        />
      </div> */}

      <div className={`h-28 flex items-center justify-center shadow-sm `}>
        <img
          // src="https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
          src={logo}
          className={`${collapsed ? "w-20" : "w-40"}`}
        />
      </div>

      {/* MENU SECTION */}
      <nav className="flex-1 mt-4 space-y-1 px-2 overflow-x-hidden">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center rounded-xl transition-all duration-300 ease-in-out mb-1
                ${
                  collapsed
                    ? "justify-center px-0 py-3"
                    : "justify-start px-4 py-3 gap-3"
                } 
                ${
                  isActive
                    ? "bg-white/40 text-black shadow-md"
                    : "text-slate-900 hover:bg-[#fbbf24]"
                }`
              }
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <Icon size={22} strokeWidth={2.5} />
              </div>

              {/* Animate text visibility */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* USER BOTTOM SECTION */}
      {/* <div
        className={`border-t border-slate-700/20 p-3 flex items-center transition-all duration-300 ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <Avatar
          size={collapsed ? "default" : "large"}
          icon={<UserOutlined />}
          className="transition-all duration-300"
          style={{ backgroundColor: "#1e40af", flexShrink: 0 }}
        />

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-hidden"
          >
            <div className="text-sm font-semibold text-slate-900 truncate">
              {user?.email || "User"}
            </div>
            <div className="text-xs text-slate-600 truncate">
              {user?.role?.name}
            </div>
          </motion.div>
        )}

        {!collapsed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="text-slate-600 hover:text-red-600 cursor-pointer transition-colors"
          >
            <LogoutOutlined />
          </motion.button>
        )}
      </div> */}

      <div
        className={`border-t p-3 flex items-center ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        {isLoggedIn ? (
          <>
            <Avatar icon={<UserOutlined />} />
            {!collapsed && (
              <>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{user?.email}</div>
                  <div className="text-xs text-gray-500">
                    {user?.role?.name}
                  </div>
                </div>
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    logout();
                    navigate("/", { replace: true });
                  }}
                >
                  <LogoutOutlined />
                </button>
              </>
            )}
          </>
        ) : (
          <div
            onClick={() => navigate("/login")}
            className=" shadow-2xl cursor-pointer px-3 py-1 text-blue-500 rounded-md bg-white/40"
          >
            <span>
              <UserOutlined />
            </span>
            <button className="ml-2 cursor-pointer">Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
