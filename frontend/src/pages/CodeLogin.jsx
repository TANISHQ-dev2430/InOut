import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function CodeLogin() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const enteredCode = code.trim().toUpperCase();

    try {
      const q = query(collection(db, "accessCodes"), where("code", "==", enteredCode));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Invalid code.");
        setLoading(false);
        return;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      const uid = doc.id;

      if (data.used) {
        setError("This code has already been used.");
        setLoading(false);
        return;
      }

      // Normalize and log role for debugging (handles case/whitespace issues)
      const rawRole = data.role ?? "";
      const role = String(rawRole).trim().toLowerCase();
      console.log("CodeLogin: fetched role =", rawRole, "normalized ->", role, "docId=", uid);

      // Mark access code as used (only update the allowed fields)
      try {
        await updateDoc(doc(db, "accessCodes", uid), {
          used: true,
          lastLoginAt: new Date().toISOString()
        });
      } catch (uErr) {
        console.warn("Failed to mark code used:", uErr);
        // continue — navigation can still happen depending on your rules
      }

      // Save important user details in localStorage for other pages
      localStorage.setItem("uid", uid);
      localStorage.setItem("role", role);
      localStorage.setItem("institute", data.targetData?.institute || "");
      localStorage.setItem("code", enteredCode);
      // Keep a full copy as well for convenience
      const userDetails = { uid, role, code: enteredCode, ...data };
      localStorage.setItem("currentUser", JSON.stringify(userDetails));

      // Navigate based on normalized role, with a safe fallback
      if (role === "superadmin") {
        navigate("/superadmin");
      } else if (role === "admin") {
        navigate("/admin");
      } else if (role === "guard") {
        navigate("/guard");
      } else {
        console.warn("Unknown role (after normalization):", rawRole);
        setError("Unknown role.");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818]">
      <div className="w-full max-w-xs">
        <button
          className="text-white text-xl mb-4 ml-2 hover:text-yellow-300"
          onClick={() => navigate("/")}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-transparent border border-white/80 rounded-2xl px-8 py-10 flex flex-col gap-6 shadow-lg"
          autoComplete="off"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-2">InOut.</h1>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white tracking-widest text-center mb-2">
              ENTER CODE
            </label>
            <input
              type="text"
              className="rounded-full px-4 py-2 bg-transparent border border-white/80 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-center"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
            />
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
    </div>
  );
}
