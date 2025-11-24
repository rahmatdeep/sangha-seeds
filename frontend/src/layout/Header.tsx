import { theme } from "../theme";
import { FaSeedling, FaBell } from "react-icons/fa";

export default function Header() {
  return (
    <header
      className="w-full shadow-sm px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-30"
      style={{
        background: theme.colors.surface,
        height: theme.headerHeight,
      }}
    >
      <div className="flex items-center gap-2">
        <FaSeedling className="text-[color:#A3C585] text-xl" />
        <span
          className="text-lg font-bold"
          style={{ color: theme.colors.primary }}
        >
          Sangha Seeds
        </span>
      </div>
      <button className="text-gray-500 hover:text-[color:#A3C585]">
        <FaBell className="text-xl" />
      </button>
    </header>
  );
}
