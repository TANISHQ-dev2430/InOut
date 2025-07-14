import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "/firebase.js";

export default function AdminCreate() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    institute: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "accessCodes"), {
        code: formData.code,
        role: formData.role,
        used: false,
        targetData: {
          name: formData.name,
          institute: formData.institute
        },
        createdAt: serverTimestamp()
      });

      alert("Admin/Superadmin created successfully!");
      setFormData({ name: "", code: "", institute: "", role: "" });
    } catch (err) {
      console.error("Error creating admin/superadmin:", err);
      alert("Failed to create admin/superadmin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6">
      <button
        className="text-white text-lg mb-4 flex items-center gap-2"
        onClick={() => window.history.back()}
      >
        <span>&larr;</span> 
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Admin/Guards</h1>
        <button
          className="bg-[#E1FF01] text-black font-bold px-6 py-1 rounded hover:bg-yellow-300 transition"
          onClick={() => window.location.href = "/Admin"}
        >
          All list
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1E1E1E] border border-white/80 rounded-2xl px-8 py-10 w-full max-w-lg mx-auto flex flex-col gap-8 shadow-lg"
        autoComplete="off"
      >
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-white tracking-wide">Role *</label>
          <select
            name="role"
            className="rounded-lg px-4 py-3 bg-[#333] border border-white/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={formData.role}
            onChange={(e) => {
              handleChange(e);
              const prefix = e.target.value === "guard" ? "G" : "A";
              const code = prefix + Math.floor(1000 + Math.random() * 9000).toString();
              setFormData((prev) => ({ ...prev, code }));
            }}
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="admin">Admin</option>
            <option value="guard">Guard</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-white tracking-wide">Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Employee Name"
            className="rounded-lg px-4 py-3 bg-[#333] border border-white/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-white tracking-wide">College/University Name *</label>
          <input
            type="text"
            name="institute"
            placeholder="Enter College/University Name"
            className="rounded-lg px-4 py-3 bg-[#333] border border-white/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={formData.institute}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-white tracking-wide">CODE *</label>
          <input
            type="text"
            name="code"
            placeholder="Generated Code"
            className="rounded-lg px-4 py-3 bg-[#333] border border-white/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={formData.code}
            readOnly
            required
          />
        </div>

        {formData.role === "guard" && (
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-white tracking-wide">Gate *</label>
            <input
              type="text"
              name="gate"
              placeholder="Enter Gate"
              className="rounded-lg px-4 py-3 bg-[#333] border border-white/60 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
              value={formData.gate}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="mt-4 bg-[#E1FF01] text-black font-bold rounded-lg py-3 transition-colors hover:bg-yellow-500 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}