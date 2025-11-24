import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaUser,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";
import { theme } from "../theme";

const navItems = [
  { to: "/orders", label: "Orders", icon: <FaBoxOpen /> },
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/profile", label: "Profile", icon: <FaUser /> },
];

interface NavbarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export default function Navbar({ expanded, setExpanded }: NavbarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className="hidden sm:flex flex-col fixed left-0 top-14 bottom-0 transition-all duration-200 z-20"
        style={{
          width: expanded ? 192 : 64,
          background: theme.colors.surface,
          borderRight: `1px solid ${theme.colors.accent}`,
        }}
      >
        {/* Toggle Button */}
        <button
          className="absolute -right-3 top-4 w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-md hover:shadow-lg transition-shadow"
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
        <div className="flex flex-col gap-1 mt-12 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-150
                ${isActive ? "font-bold" : ""}
                ${expanded ? "justify-start" : "justify-center"}`
              }
              style={({ isActive }) => ({
                color: isActive ? theme.colors.secondary : theme.colors.primary,
                background: isActive ? theme.colors.accent : "transparent",
              })}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              {expanded && (
                <span className="text-base whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 shadow-lg z-30 sm:hidden"
        style={{
          background: theme.colors.surface,
          borderColor: theme.colors.accent,
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${
                isActive ? "font-bold" : ""
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? theme.colors.secondary : theme.colors.primary,
            })}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
