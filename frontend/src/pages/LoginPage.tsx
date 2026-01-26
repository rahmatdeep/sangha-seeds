import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FaSeedling, FaEnvelope, FaLock } from "react-icons/fa";
import { getUser, login } from "../api";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      const user = await getUser();
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image/Brand (Hidden on mobile, 50% on desktop) */}
      <div
        className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.secondaryDark} 100%)`,
        }}
      >
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${theme.colors.secondaryLight}, transparent 70%)`,
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />

        {/* Floating seed particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 12}%`,
              top: `${10 + (i % 3) * 30}%`,
              animation: `float-seed ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.15,
            }}
          >
            <FaSeedling
              style={{
                fontSize: `${1 + (i % 3) * 0.5}rem`,
                color: theme.colors.surface,
                filter: "blur(0.5px)",
              }}
            />
          </div>
        ))}

        {/* Background pattern with subtle animation */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${theme.colors.primaryDark} 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
              animation: "drift 20s linear infinite",
            }}
          />
        </div>

        {/* Content with entrance animation */}
        <div
          className="relative z-10 text-center"
          style={{
            animation: "fade-in-up 0.8s ease-out",
          }}
        >
          <div
            style={{
              animation: "scale-pulse 3s ease-in-out infinite",
            }}
          >
            <FaSeedling
              className="mx-auto mb-6"
              style={{
                fontSize: "5rem",
                color: theme.colors.surface,
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
              }}
            />
          </div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              color: theme.colors.surface,
              textShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            Sangha Seeds
          </h1>
          <p
            className="text-base mt-2 opacity-90 max-w-sm mx-auto"
            style={{
              color: theme.colors.surface,
              lineHeight: "1.6",
            }}
          >
            Manage your potato farm operations with ease
          </p>
        </div>

        {/* CSS Keyframes */}
        <style>{`
          @keyframes float-seed {
            0%, 100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-20px) translateX(10px) rotate(120deg);
            }
            66% {
              transform: translateY(-10px) translateX(-10px) rotate(240deg);
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.1);
            }
          }

          @keyframes drift {
            from {
              transform: translate(0, 0);
            }
            to {
              transform: translate(30px, 30px);
            }
          }

          @keyframes scale-pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="flex-1 md:w-1/2 flex items-center justify-center p-6 md:p-12"
        style={{ background: theme.colors.background }}
      >
        <div
          className="w-full max-w-md"
          style={{
            animation: "slide-in-right 0.8s ease-out",
          }}
        >
          {/* Mobile-only header */}
          <div className="md:hidden text-center mb-8">
            <FaSeedling
              className="mx-auto mb-4"
              style={{ fontSize: "3rem", color: theme.colors.secondary }}
            />
            <h1
              className="text-2xl font-bold"
              style={{ color: theme.colors.primary }}
            >
              Sangha Seeds
            </h1>
          </div>

          {/* Login Form Card */}
          <div
            className="rounded-2xl shadow-2xl p-10"
            style={{ background: theme.colors.surface }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: theme.colors.primary }}
            >
              Welcome Back
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: theme.colors.primary, opacity: 0.6 }}
            >
              Sign in to continue to your dashboard
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: theme.colors.primary }}
                >
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.primary, opacity: 0.4 }}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border-2 outline-none transition-all focus:border-opacity-100"
                    style={{
                      borderColor: theme.colors.accentDark,
                      color: theme.colors.primary,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = theme.colors.secondary)
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = theme.colors.accentDark)
                    }
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium"
                  style={{ color: theme.colors.primary }}
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.primary, opacity: 0.4 }}
                  />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border-2 outline-none transition-all"
                    style={{
                      borderColor: theme.colors.accentDark,
                      color: theme.colors.primary,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = theme.colors.secondary)
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = theme.colors.accentDark)
                    }
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="text-sm px-4 py-3 rounded-lg"
                  style={{
                    color: theme.colors.error,
                    background: `${theme.colors.error}15`,
                    border: `1px solid ${theme.colors.error}30`,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{
                  background: loading
                    ? theme.colors.accent
                    : theme.colors.secondary,
                  transform: loading ? "scale(0.98)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.background =
                      theme.colors.secondaryDark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = theme.colors.secondary;
                  }
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Logging in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p
                className="text-xs"
                style={{ color: theme.colors.primary, opacity: 0.5 }}
              >
                © 2025 Sangha Seeds. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
