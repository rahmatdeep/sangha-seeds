import { useNavigate } from "react-router-dom";
import { theme } from "../theme";

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-4">
      {/* ...your profile info here... */}
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 rounded-lg text-white font-semibold"
        style={{
          background: theme.colors.error,
          borderRadius: theme.borderRadius.lg,
        }}
      >
        Log Out
      </button>
    </div>
  );
}
