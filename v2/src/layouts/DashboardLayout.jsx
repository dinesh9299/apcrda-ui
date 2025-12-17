import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(true);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar (fixed height, no scroll) */}
      <Sidebar collapsed={collapsed} />

      {/* Mobile Drawer */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header (fixed height) */}
        <Header
          onMenuClick={handleMenuClick}
          isSidebarOpen={window.innerWidth < 1024 ? mobileOpen : !collapsed}
        />

        {/* ✅ ONLY THIS SCROLLS */}
        <main className="flex-1 overflow-y-auto bg-gray-100 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
