import { useEffect, useState } from "react";
import { theme } from "../../theme";
import { IoCheckmarkCircle, IoCloseCircle, IoClose } from "react-icons/io5";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === "success";
  const bgColor = isSuccess ? theme.colors.success : theme.colors.error;
  const Icon = isSuccess ? IoCheckmarkCircle : IoCloseCircle;

  return (
    <div
      style={{
        animation: isExiting
          ? "slideOutRight 0.3s ease-out forwards"
          : "slideInRight 0.3s ease-out",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px]"
        style={{
          backgroundColor: theme.colors.surface,
          border: `2px solid ${bgColor}`,
        }}
      >
        <Icon className="w-5 h-5 shrink-0" style={{ color: bgColor }} />
        <span
          className="flex-1 text-sm font-medium"
          style={{ color: theme.colors.primary }}
        >
          {message}
        </span>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="shrink-0 hover:opacity-70 transition-opacity"
          style={{ color: theme.colors.primary }}
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>

      {/* Inline keyframe animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
