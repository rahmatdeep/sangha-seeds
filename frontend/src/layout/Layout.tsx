// Layout.tsx - Updated for floating nav
import { theme } from "../theme";
import Header from "./Header";
import Navbar from "./Navbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
        <main
          className="flex-1 overflow-y-auto p-4 pb-24 sm:pb-4 transition-all duration-300"
          style={{
            marginLeft:
              window.innerWidth >= 640 ? (sidebarExpanded ? 192 : 64) : 0,
            marginTop: theme.headerHeight,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
