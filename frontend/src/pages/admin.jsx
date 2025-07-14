import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "/firebase.js";
import { useNavigate } from "react-router-dom";

export default function SuperAdminPage() {
  const [admins, setAdmins] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoggedInUserInstitute = async () => {
      try {
        const userId = localStorage.getItem("loggedInUserId"); // Replace with actual logic to get user ID
        if (!userId) throw new Error("User ID not found");

        const userDoc = await getDocs(collection(db, "users"));
        const userData = userDoc.docs.find((doc) => doc.id === userId)?.data();

        if (!userData || !userData.institute) throw new Error("Institute not found");

        const institute = userData.institute;

        const querySnapshot = await getDocs(collection(db, "accessCodes"));
        const adminData = querySnapshot.docs
          .map((doc, index) => ({
            id: doc.id,
            serial: index + 1,
            ...doc.data()
          }))
          .filter((admin) => admin.targetData?.institute === institute);

        setAdmins(adminData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchLoggedInUserInstitute();
  }, []);

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6">
      <button
        className="text-white text-lg mb-4 flex items-center gap-2"
        onClick={() => navigate("/codelogin")}
      >
        <span>&larr;</span> 
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hello SuperAdmin,</h1>
        <button
          className="bg-[#E1FF01] text-black font-bold px-4 py-2 rounded hover:bg-yellow-300 transition"
          onClick={() => window.location.href = "/Superadmincreate"}
        >
          Create
        </button>
      </div>
      <p className="text-lg mb-6 font-semibold">Here is the list of all superadmin and admins:</p>

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
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-[#444]">
                  <td className="border border-white px-4 py-2 text-center">{admin.serial}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.targetData?.name || "N/A"}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.code}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.role}</td>
                  <td className="border border-white px-4 py-2 text-center">{admin.targetData?.institute || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
