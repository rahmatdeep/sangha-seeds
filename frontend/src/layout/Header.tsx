import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FaSeedling, FaBell, FaSearch } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const handleSearchClick = () => {
    // TODO: Open advanced search modal
  };

  const handleNotificationClick = () => {
    // TODO: Handle notification click
  };

  return (
    <header
      className="w-full shadow-md px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-30 backdrop-blur-sm transition-all duration-300"
      style={{
        background: `${theme.colors.surface}f5`,
        height: theme.headerHeight,
        borderBottom: `1px solid ${theme.colors.accent}`,
      }}
    >
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 group cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div
          className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
          style={{ background: `${theme.colors.accent}80` }}
        >
          <FaSeedling
            className="text-xl transition-all duration-300"
            style={{ color: theme.colors.secondary }}
          />
        </div>
        <span
          className="text-lg font-bold transition-all duration-300"
          style={{ color: theme.colors.primary }}
        >
          Sangha Seeds
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: theme.colors.accent,
            color: theme.colors.primary,
          }}
          aria-label="Search"
        >
          <FaSearch className="text-base" />
        </button>

        {/* Notification Button */}
        <button
          onClick={handleNotificationClick}
          className="p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 relative group"
          style={{
            background: theme.colors.accent,
            color: theme.colors.primary,
          }}
          aria-label="Notifications"
        >
          <FaBell className="text-base" />

          {/* Notification badge */}
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: theme.colors.error,
              color: theme.colors.surface,
            }}
          >
            {/* Number of notifications */}
          </span>
        </button>
      </div>
    </header>
  );
}
