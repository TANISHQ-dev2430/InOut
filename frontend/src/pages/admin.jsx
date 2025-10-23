import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "/firebase.js";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const uid = localStorage.getItem("uid");
      const role = localStorage.getItem("role");

      if (!uid || role !== "admin") {
      navigate("/codelogin");
  }
    const fetchInstituteAndUsers = async () => {
      try {
        const uid = localStorage.getItem("uid"); // From CodeLogin
        if (!uid) throw new Error("UID not found in localStorage");

        const userDoc = await getDoc(doc(db, "accessCodes", uid));
        if (!userDoc.exists()) throw new Error("User document not found");

        const userData = userDoc.data();
        const userInstitute = userData?.targetData?.institute;
        if (!userInstitute) throw new Error("Institute not found");

        const snapshot = await getDocs(collection(db, "accessCodes"));
        const filtered = snapshot.docs
          .map((doc, idx) => ({
            id: doc.id,
            serial: idx + 1,
            ...doc.data()
          }))
          .filter((entry) =>
            (entry.role === "admin" || entry.role === "guard") &&
            entry.targetData?.institute === userInstitute
          );

        setAdmins(filtered);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchInstituteAndUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6">
      <button
        className="text-white text-lg mb-4 flex items-center gap-2"
        onClick={() => navigate("/codelogin")}
      >
        <span>&larr;</span> Back
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hello Admin,</h1>
        <button
          className="bg-[#E1FF01] text-black font-bold px-4 py-2 rounded hover:bg-yellow-300 transition"
          onClick={() => navigate("/adminCreate")}
        >
          Create
        </button>
      </div>

      <p className="text-lg mb-6 font-semibold">Here is the list of all Admins from your institute:</p>

      <div className="overflow-x-auto mb-8">
        <table className="table-auto w-full border-collapse border border-white">
          <thead>
            <tr className="bg-[#333]">
              <th className="border border-white px-4 py-2">S.NO</th>
              <th className="border border-white px-4 py-2">NAME</th>
              <th className="border border-white px-4 py-2">CODE</th>
              <th className="border border-white px-4 py-2">ROLE</th>
              <th className="border border-white px-4 py-2">INSTITUTE</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Loading...</td>
              </tr>
            ) : admins.filter(admin => admin.role === "admin").length > 0 ? (
              admins.filter(admin => admin.role === "admin").map((admin, index) => (
                <tr key={admin.id} className="hover:bg-[#444]">
                  <td className="border border-white px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.targetData?.name || "N/A"}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.code}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.role}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.targetData?.institute || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No Admins available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-lg mb-6 font-semibold">Here is the list of all Guards from your institute:</p>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-white">
          <thead>
            <tr className="bg-[#333]">
              <th className="border border-white px-4 py-2">S.NO</th>
              <th className="border border-white px-4 py-2">NAME</th>
              <th className="border border-white px-4 py-2">CODE</th>
              <th className="border border-white px-4 py-2">ROLE</th>
              <th className="border border-white px-4 py-2">INSTITUTE</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Loading...</td>
              </tr>
            ) : admins.filter(admin => admin.role === "guard").length > 0 ? (
              admins.filter(admin => admin.role === "guard").map((admin, index) => (
                <tr key={admin.id} className="hover:bg-[#444]">
                  <td className="border border-white px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.targetData?.name || "N/A"}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.code}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.role}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.targetData?.institute || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No Guards available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
