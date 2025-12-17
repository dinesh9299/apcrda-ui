// import { Avatar, Popover, Button, Tag } from "antd";
// import {
//   UserOutlined,
//   MenuOutlined,
//   CloseOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
// } from "@ant-design/icons";
// import { getUser, isAuthenticated, logout } from "../utils/auth";
// import { useNavigate } from "react-router-dom";

// export default function Header({ onMenuClick, isSidebarOpen }) {
//   const navigate = useNavigate();
//   const user = getUser();

//   const popoverContent = (
//     <div style={{ minWidth: 220 }}>
//       <p>
//         <strong>Status:</strong>{" "}
//         <Tag color={isAuthenticated() ? "green" : "red"}>
//           {isAuthenticated() ? "Authenticated" : "Not Logged In"}
//         </Tag>
//       </p>

//       {user && (
//         <>
//           <p>
//             <strong>Email:</strong> {user.email}
//           </p>
//           <Tag color="blue">{user.role?.name}</Tag>
//         </>
//       )}

//       <Button
//         danger
//         block
//         style={{ marginTop: 12 }}
//         onClick={() => {
//           logout();
//           navigate("/login", { replace: true });
//         }}
//       >
//         Logout
//       </Button>
//     </div>
//   );

//   return (
//     <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-2 ">
//       {/* Toggle icon */}
//       <button
//         onClick={onMenuClick}
//         className="p-2 cursor-pointer rounded-md hover:bg-gray-100 transition"
//       >
//         {isSidebarOpen ? (
//           <MenuFoldOutlined style={{ fontSize: 20 }} />
//         ) : (
//           <MenuUnfoldOutlined style={{ fontSize: 20 }} />
//         )}
//       </button>

//       <span className="font-semibold">APCRDA</span>

//       <Popover content={popoverContent} trigger="click" placement="bottomRight">
//         <Avatar
//           icon={<UserOutlined />}
//           style={{ cursor: "pointer", backgroundColor: "#1677ff" }}
//         />
//       </Popover>
//     </header>
//   );
// }

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import logo from "../images/am1.png";

export default function Header({ onMenuClick, isSidebarOpen }) {
  return (
    <header className="relative h-28 w-full overflow-hidden shadow-md">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#fde68a]" />

      {/* CURVED WAVE EFFECT */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-white/40 rounded-t-[100%]" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center px-4">
        {/* LEFT — Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 cursor-pointer rounded-md bg-white/70 hover:bg-white transition"
          >
            {isSidebarOpen ? (
              <MenuFoldOutlined style={{ fontSize: 20 }} />
            ) : (
              <MenuUnfoldOutlined style={{ fontSize: 20 }} />
            )}
          </button>

          <img
            src={logo}
            alt="Amaravati Logo "
            className="h-56 object-contain"
          />
        </div>

        {/* CENTER — TITLE */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-2xl font-bold text-black">
            Andhra Pradesh Capital Region Development Authority
          </h1>
          <p className="text-sm font-medium text-gray-800">
            Government of Andhra Pradesh
          </p>
        </div>
      </div>
    </header>
  );
}

// import {
//   DoubleLeftOutlined,
//   LeftOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   RightOutlined,
// } from "@ant-design/icons";
// import logo from "../images/logo-3.png";

// export default function Header({ onMenuClick, isSidebarOpen }) {
//   return (
//     <header className="h-20 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 flex items-center px-4 relative">
//       {/* LEFT — Menu Toggle */}
//       <button
//         onClick={onMenuClick}
//         className="p-2 rounded-md cursor-pointer  bg-gray-100 transition"
//       >
//         {isSidebarOpen ? (
//           <MenuFoldOutlined style={{ fontSize: 20 }} />
//         ) : (
//           <MenuUnfoldOutlined style={{ fontSize: 20 }} />
//         )}
//       </button>

//       {/* CENTER — APCRDA TEXT */}
//       <div className="absolute left-1/2 -translate-x-1/2 text-center leading-tight">
//         <div className="text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
//           APCRDA
//         </div>
//         <div className="text-xs text-gray-500">
//           Andhra Pradesh Capital Region Development Authority
//         </div>
//       </div>

//       {/* RIGHT — APCRDA LOGO */}
//       <div className="ml-auto">
//         <img src={logo} alt="APCRDA Logo" className="h-14 object-contain" />
//       </div>
//     </header>
//   );
// }
