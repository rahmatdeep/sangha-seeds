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
      const user = await getUser(token);
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
        style={{ background: theme.colors.secondary }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${theme.colors.primary} 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <FaSeedling
            className="mx-auto mb-6"
            style={{ fontSize: "5rem", color: theme.colors.surface }}
          />
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: theme.colors.surface }}
          >
            Sangha Seeds
          </h1>
          <p
            className="text-sm mt-2 opacity-90"
            style={{ color: theme.colors.surface }}
          >
            Manage your potato farm operations with ease
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="flex-1 md:w-1/2 flex items-center justify-center p-6 md:p-12"
        style={{ background: theme.colors.background }}
      >
        <div className="w-full max-w-md">
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
            className="rounded-2xl shadow-2xl p-8"
            style={{ background: theme.colors.surface }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: theme.colors.primary }}
            >
              Welcome Back
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: theme.colors.primary, opacity: 0.6 }}
            >
              Sign in to continue to your dashboard
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.primary, opacity: 0.4 }}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 outline-none transition-all focus:border-opacity-100"
                    style={{
                      borderColor: theme.colors.accent,
                      color: theme.colors.primary,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = theme.colors.secondary)
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = theme.colors.accent)
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
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: theme.colors.primary, opacity: 0.4 }}
                  />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 outline-none transition-all"
                    style={{
                      borderColor: theme.colors.accent,
                      color: theme.colors.primary,
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = theme.colors.secondary)
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = theme.colors.accent)
                    }
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="text-sm px-4 py-2 rounded-lg"
                  style={{
                    color: theme.colors.error,
                    background: `${theme.colors.error}15`,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? theme.colors.accent
                    : theme.colors.secondary,
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
            <div className="mt-6 text-center">
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
