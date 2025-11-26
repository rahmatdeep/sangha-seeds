import { useState, useCallback, type ReactNode } from "react";
import Toast from "./Toast";
import { ToastContext, type ToastContextType } from "../../hooks/toastContext";

interface ToastData {
  id: number;
  message: string;
  type: "success" | "error";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type: "success" }]);
  }, []);

  const showError = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type: "error" }]);
  }, []);

  const value: ToastContextType = {
    showSuccess,
    showError,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Updated container with better positioning */}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          pointerEvents: "none", // Allow clicks to pass through container
        }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: "auto" }}>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
              duration={3000}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
