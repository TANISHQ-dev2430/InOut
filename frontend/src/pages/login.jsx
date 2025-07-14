import React, { useState } from "react";
import { WebPortal, LoginError } from "jsjiit";
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create the WebPortal instance
      const w = new WebPortal();

      // Login using the student_login method
      await w.student_login(enrollment, password);

      // Store credentials if needed
      localStorage.setItem("username", enrollment);
      localStorage.setItem("password", password);

      // Optional callback
      if (onLoginSuccess) onLoginSuccess(w);

      // Redirect to profile
      navigate("/profile");
    } catch (err) {
      if (err instanceof LoginError && err.message.includes("temporarily unavailable")) {
        setError("JIIT Portal is temporarily down. Try again later.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Please check your internet connection or portal access.");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818]">
      <form
        onSubmit={handleSubmit}
        className="bg-transparent border border-white/80 rounded-2xl px-8 py-10 w-full max-w-xs flex flex-col gap-6 shadow-lg"
        autoComplete="off"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-2">InOut.</h1>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-white tracking-widest">ENROLLMENT</label>
          <input
            type="text"
            className="rounded-full px-4 py-2 bg-transparent border border-white/80 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-white tracking-widest">PASSWORD</label>
          <input
            type="password"
            className="rounded-full px-4 py-2 bg-transparent border border-white/80 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-xs text-white underline hover:text-yellow-300"
            onClick={() => navigate("/codelogin")}
          >
            LOGIN WITH CODE
          </button>
        </div>

        {error && <div className="text-xs text-red-400 text-center">{error}</div>}

        <button
          type="submit"
          className="mt-2 bg-[#E1FF01] text-black font-bold rounded-full py-2 transition-colors hover:bg-yellow-300 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
}
