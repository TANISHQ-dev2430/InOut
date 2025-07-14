// src/utils/createSuperadmin.js
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const createSuperadmin = async (uid, name, email) => {
  try {
    await setDoc(doc(db, "users", uid), {
      name,
      role: "superadmin",
      email,
      createdAt: serverTimestamp(),
    });

    console.log("Superadmin created!");
  } catch (error) {
    console.error("Error creating superadmin:", error);
  }
};
