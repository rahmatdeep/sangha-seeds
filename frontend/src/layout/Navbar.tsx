import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FaHome,
  FaBoxOpen,
  FaUser,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";
import { theme } from "../theme";

// Desktop: Dashboard first, Mobile: Dashboard in middle
const desktopNavItems = [
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/orders", label: "Orders", icon: <FaBoxOpen /> },
  { to: "/profile", label: "Profile", icon: <FaUser /> },
];

const mobileNavItems = [
  { to: "/orders", label: "Orders", icon: <FaBoxOpen /> },
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/profile", label: "Profile", icon: <FaUser /> },
];

interface NavbarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export default function Navbar({ expanded, setExpanded }: NavbarProps) {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = mobileNavItems.findIndex(
      (item) => item.to === location.pathname
    );
    if (activeIndex !== -1 && navRefs.current[activeIndex]) {
      const activeTab = navRefs.current[activeIndex];
      if (activeTab) {
        setIndicatorStyle({
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
        });
      }
    }
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className="hidden sm:flex flex-col fixed left-0 top-14 bottom-0 transition-all duration-300 ease-out z-20"
        style={{
          width: expanded ? 192 : 64,
          background: theme.colors.surface,
          borderRight: `1px solid ${theme.colors.accent}`,
        }}
      >
        {/* Toggle Button */}
        <button
          className="absolute -right-3 top-4 w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-180"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            background: theme.colors.surface,
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.accent}`,
          }}
        >
          {expanded ? <FaChevronLeft /> : <FaBars />}
        </button>

        {/* Nav Items */}
        <div className="flex flex-col gap-2 mt-12 px-2">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3.5 rounded-lg transition-all duration-300 ease-out relative overflow-hidden group
                ${isActive ? "font-semibold" : "hover:translate-x-1"}
                ${expanded ? "justify-start" : "justify-center"}
                active:scale-95`
              }
              style={({ isActive }) => ({
                color: isActive ? theme.colors.secondary : theme.colors.primary,
                background: isActive ? theme.colors.accent : "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Animated background on hover */}
                  <div
                    className="absolute inset-0 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"
                    style={{
                      background: `${theme.colors.accent}60`,
                      transform: isActive ? "scale(1)" : "scale(0)",
                    }}
                  />

                  {/* Icon */}
                  <span
                    className="text-xl shrink-0 relative z-10 transition-all duration-300 group-hover:scale-110"
                    style={{
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  {expanded && (
                    <span className="text-base whitespace-nowrap overflow-hidden relative z-10 transition-all duration-300">
                      {item.label}
                    </span>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300"
                      style={{ background: theme.colors.secondary }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden px-4 pb-4">
        <nav
          className="relative rounded-2xl backdrop-blur-lg backdrop-filter shadow-2xl mx-auto overflow-hidden"
          style={{
            background: `${theme.colors.surface}cc`,
            border: `1px solid ${theme.colors.accent}80`,
            maxWidth: "400px",
            boxShadow: `0 8px 32px rgba(92, 74, 58, 0.12), 0 2px 8px rgba(92, 74, 58, 0.08)`,
          }}
        >
          {/* Sliding Indicator */}
          <div
            className="absolute top-0 transition-all duration-500 ease-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              height: "100%",
              background: `linear-gradient(180deg, ${theme.colors.secondary} 0%, ${theme.colors.accent}40 4px, ${theme.colors.accent}40 100%)`,
              pointerEvents: "none",
            }}
          />

          {/* Nav Items */}
          <div className="flex justify-around items-center py-3">
            {mobileNavItems.map((item, index) => {
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  ref={(el) => {
                    navRefs.current[index] = el;
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 relative py-2 px-6 min-w-20 group flex-1 active:scale-90 transition-transform duration-200"
                >
                  {/* Icons */}
                  <span
                    className="text-2xl relative z-10 block transition-all duration-500 ease-out"
                    style={{
                      transform: isActive
                        ? "scale(1.2) translateY(-4px)"
                        : "scale(1)",
                      color: isActive
                        ? theme.colors.secondary
                        : theme.colors.primary,
                      filter: isActive
                        ? `drop-shadow(0 2px 4px ${theme.colors.secondary}40)`
                        : "none",
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span
                    className="text-xs relative z-10 transition-all duration-500 ease-out"
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? theme.colors.secondary
                        : theme.colors.primary,
                      opacity: isActive ? 1 : 0.7,
                      transform: isActive ? "translateY(0)" : "translateY(2px)",
                      letterSpacing: isActive ? "0.03em" : "normal",
                    }}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
