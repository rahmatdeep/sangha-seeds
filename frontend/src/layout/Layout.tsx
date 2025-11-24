import { theme } from "../theme";
import Header from "./Header";
import Navbar from "./Navbar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
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
          className="flex-1 overflow-y-auto p-4 pb-20 sm:pb-4 transition-all duration-200"
          style={{
            marginLeft:
              window.innerWidth >= 640 ? (sidebarExpanded ? 192 : 64) : 0,
            marginTop: theme.headerHeight,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
