// import SidebarContent from "./SidebarContent";

// export default function Sidebar({ collapsed }) {
//   return (
//     <aside
//       className="
//         hidden lg:flex flex-col h-screen text-white
//         bg-[#fde68a]
//         transition-all duration-300
//       "
//       style={{
//         width: collapsed ? 50 : 260,
//       }}
//     >
//       {/* Sidebar content should NOT scroll */}
//       <SidebarContent collapsed={collapsed} />
//     </aside>
//   );
// }

import SidebarContent from "./SidebarContent";
import CurveSeparator from "./curveseparator";

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className="
        relative hidden lg:flex flex-col h-screen
        // bg-[#f59e0b]
        bg-gradient-to-t from-[#f59e0b] via-[#fbbf24] to-[#fde68a]
        text-slate-900
        shadow-lg
        overflow-hidden
        transition-all duration-300
      "
      style={{ width: collapsed ? 56 : 260 }}
    >
      {/* CURVED SEPARATOR LINE */}
      {/* <CurveSeparator /> */}

      <SidebarContent collapsed={collapsed} />
    </aside>
  );
}

// import SidebarContent from "./SidebarContent";

// export default function Sidebar({ collapsed }) {
//   return (
//     <aside
//       className="
//         hidden lg:flex flex-col h-screen
//         bg-gradient-to-b from-[#f59e0b] to-[#d97706]
//         text-slate-900
//         transition-all duration-300
//         shadow-lg
//       "
//       style={{
//         width: collapsed ? 56 : 260,
//       }}
//     >
//       <SidebarContent collapsed={collapsed} />
//     </aside>
//   );
// }
