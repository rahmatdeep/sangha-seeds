import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FaHome,
  FaBoxOpen,
  FaUser,
  FaBars,
  FaChevronLeft,
  FaPlus,
  FaTimes,
  FaWarehouse,
  FaSeedling,
  FaLayerGroup,
  FaUsers,
} from "react-icons/fa";
import { theme } from "../theme";

// Admin FAB menu items
const adminFabItems = [
  { to: "/orders", label: "Orders", icon: <FaBoxOpen /> },
  { to: "/lots", label: "Lots", icon: <FaLayerGroup /> },
  { to: "/varieties", label: "Varieties", icon: <FaSeedling /> },
  { to: "/warehouses", label: "Warehouses", icon: <FaWarehouse /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
];

// Desktop nav items for regular users
const desktopNavItems = [
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/orders", label: "Orders", icon: <FaBoxOpen /> },
  { to: "/profile", label: "Profile", icon: <FaUser /> },
];

// Desktop nav items for admin
const desktopAdminNavItems = [
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/orders", label: "Orders", icon: <FaBoxOpen /> },
  { to: "/lots", label: "Lots", icon: <FaLayerGroup /> },
  { to: "/varieties", label: "Varieties", icon: <FaSeedling /> },
  { to: "/warehouses", label: "Warehouses", icon: <FaWarehouse /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
  { to: "/profile", label: "Profile", icon: <FaUser /> },
];

// Mobile nav items for regular users
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
  const [fabOpen, setFabOpen] = useState(false);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const fabRef = useRef<HTMLDivElement>(null);

  // Get user role from localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role || "user";
    } catch {
      return "user";
    }
  };

  const isAdmin = getUserRole() === "Administrator";

  // Close FAB when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setFabOpen(false);
      }
    }

    if (fabOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [fabOpen]);

  // Update mobile nav indicator
  useEffect(() => {
    if (!isAdmin) {
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
    }
  }, [location.pathname, isAdmin]);

  // Close FAB on route change
  useEffect(() => {
    setFabOpen(false);
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
          {(isAdmin ? desktopAdminNavItems : desktopNavItems).map((item) => (
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
          className="relative rounded-2xl backdrop-blur-lg backdrop-filter shadow-2xl mx-auto overflow-visible"
          style={{
            background: `${theme.colors.surface}cc`,
            border: `1px solid ${theme.colors.accent}80`,
            maxWidth: "400px",
            boxShadow: `0 8px 32px rgba(92, 74, 58, 0.12), 0 2px 8px rgba(92, 74, 58, 0.08)`,
          }}
        >
          {/* Sliding Indicator (only for non-admin) */}
          {!isAdmin && (
            <>
              <div
                className="absolute top-0 transition-all duration-500 ease-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  height: "100%",
                  background: theme.colors.accent + "40",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
              {/* Sliding TOP Line Indicator */}
              <div
                className="absolute top-0 transition-all duration-500 ease-out rounded-t-2xl"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  height: "3px",
                  background: theme.colors.secondary,
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
            </>
          )}

          {/* Nav Items */}
          <div className="flex justify-around items-center py-3">
            {isAdmin ? (
              <>
                {/* Dashboard */}
                <NavLink
                  to="/"
                  className="flex flex-col items-center justify-center gap-1.5 relative py-2 px-6 min-w-20 group flex-1 active:scale-90 transition-transform duration-200"
                >
                  {({ isActive }) => (
                    <>
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
                        <FaHome />
                      </span>
                      <span
                        className="text-xs relative z-10 transition-all duration-500 ease-out"
                        style={{
                          fontWeight: isActive ? 600 : 400,
                          color: isActive
                            ? theme.colors.secondary
                            : theme.colors.primary,
                          opacity: isActive ? 1 : 0.7,
                          transform: isActive
                            ? "translateY(0)"
                            : "translateY(2px)",
                          letterSpacing: isActive ? "0.03em" : "normal",
                        }}
                      >
                        Dashboard
                      </span>
                    </>
                  )}
                </NavLink>

                {/* Admin FAB */}
                <div
                  ref={fabRef}
                  className="relative flex-1 flex justify-center items-center"
                >
                  <button
                    className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105 relative z-50"
                    style={{
                      background: fabOpen
                        ? theme.colors.secondary
                        : theme.colors.accent,
                      color: fabOpen
                        ? theme.colors.surface
                        : theme.colors.primary,
                      boxShadow: fabOpen
                        ? `0 8px 24px ${theme.colors.secondary}50`
                        : `0 6px 18px ${theme.colors.primary}30`,
                    }}
                    onClick={() => {
                      setFabOpen(!fabOpen);
                    }}
                    aria-label={fabOpen ? "Close menu" : "Open admin menu"}
                  >
                    <span
                      className="text-2xl transition-transform duration-300"
                      style={{
                        transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      {fabOpen ? <FaTimes /> : <FaPlus />}
                    </span>
                  </button>

                  {/* Popup Menu - With bottom arrow/notch */}
                  {fabOpen && (
                    <div
                      className="absolute rounded-3xl p-3 shadow-2xl"
                      style={{
                        bottom: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: `linear-gradient(145deg, ${theme.colors.surface} 0%, ${theme.colors.surface}f8 100%)`,
                        border: `2px solid ${theme.colors.secondary}35`,
                        boxShadow: `
          0 -8px 32px ${theme.colors.secondary}18,
          0 16px 48px ${theme.colors.primary}22,
          0 0 0 1px ${theme.colors.accent}30,
          inset 0 1px 0 rgba(255,255,255,0.08)
        `,
                        backdropFilter: "blur(20px)",
                        zIndex: 100,
                        animation:
                          "growFromCenter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transformOrigin: "bottom center",
                        willChange: "transform, opacity",
                      }}
                    >
                      {/* Bottom Arrow/Notch - Centered */}
                      <div
                        className="absolute"
                        style={{
                          bottom: "-10px",
                          left: "50%",
                          width: "20px",
                          height: "20px",
                          background: `linear-gradient(145deg, ${theme.colors.surface} 0%, ${theme.colors.surface}f8 100%)`,
                          border: `2px solid ${theme.colors.secondary}35`,
                          borderTop: "none",
                          borderLeft: "none",
                          transform: "translateX(-50%) rotate(45deg)",
                          zIndex: -1,
                        }}
                      />

                      {/* Single Row Layout with Equal Width Items */}
                      <div className="flex gap-2">
                        {adminFabItems.map((item, index) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className="flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all duration-200 active:scale-90 hover:scale-[1.05]"
                            style={({ isActive }) => ({
                              background: isActive
                                ? `${theme.colors.secondary}25`
                                : "transparent",
                              color: isActive
                                ? theme.colors.secondary
                                : theme.colors.primary,
                              border: isActive
                                ? `1.5px solid ${theme.colors.secondary}50`
                                : "1.5px solid transparent",
                              animation: `itemPopImproved 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                                index * 0.05
                              }s both`,
                              width: "65px",
                              minWidth: "65px",
                            })}
                            onClick={() => setFabOpen(false)}
                          >
                            {({ isActive }) => (
                              <>
                                <span
                                  className="text-xl transition-all duration-200"
                                  style={{
                                    transform: isActive
                                      ? "scale(1.15)"
                                      : "scale(1)",
                                    filter: isActive
                                      ? `drop-shadow(0 3px 8px ${theme.colors.secondary}45)`
                                      : "none",
                                  }}
                                >
                                  {item.icon}
                                </span>
                                <span
                                  className="text-[9px] font-semibold text-center leading-tight"
                                  style={{
                                    letterSpacing: "0.01em",
                                  }}
                                >
                                  {item.label}
                                </span>
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <style>
                  {`
                    @keyframes growFromCenter {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(15px) scale(0.85);
                    }
                    50% {
                        transform: translateX(-50%) translateY(-3px) scale(1.02);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                    }

                    @keyframes itemPopImproved {
                    0% {
                        opacity: 0;
                        transform: scale(0.6) translateY(8px);
                    }
                    50% {
                        transform: scale(1.1) translateY(-2px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    }
                 `}
                </style>

                <style>{`
@keyframes growFromCenter {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(15px) scale(0.85);
  }
  50% {
    transform: translateX(-50%) translateY(-3px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes itemPopImproved {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(8px);
  }
  50% {
    transform: scale(1.1) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
`}</style>

                {/* Updated styles in the existing style tag */}
                <style>{`
@keyframes growFromCenter {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px) scaleY(0.3);
  }
  50% {
    transform: translateX(-50%) translateY(-5px) scaleY(1.05);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scaleY(1);
  }
}

@keyframes itemPopImproved {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(8px);
  }
  50% {
    transform: scale(1.1) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
`}</style>

                {/* Profile */}
                <NavLink
                  to="/profile"
                  className="flex flex-col items-center justify-center gap-1.5 relative py-2 px-6 min-w-20 group flex-1 active:scale-90 transition-transform duration-200"
                >
                  {({ isActive }) => (
                    <>
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
                        <FaUser />
                      </span>
                      <span
                        className="text-xs relative z-10 transition-all duration-500 ease-out"
                        style={{
                          fontWeight: isActive ? 600 : 400,
                          color: isActive
                            ? theme.colors.secondary
                            : theme.colors.primary,
                          opacity: isActive ? 1 : 0.7,
                          transform: isActive
                            ? "translateY(0)"
                            : "translateY(2px)",
                          letterSpacing: isActive ? "0.03em" : "normal",
                        }}
                      >
                        Profile
                      </span>
                    </>
                  )}
                </NavLink>
              </>
            ) : (
              // Regular user navigation
              mobileNavItems.map((item, index) => {
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
                        transform: isActive
                          ? "translateY(0)"
                          : "translateY(2px)",
                        letterSpacing: isActive ? "0.03em" : "normal",
                      }}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                );
              })
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
