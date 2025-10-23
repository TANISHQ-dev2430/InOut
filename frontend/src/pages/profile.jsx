import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";

export default function Profile({ w }) {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [hostelData, setHostelData] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await w.get_personal_info();
        const hostel = await w.get_hostel_details();
        setProfileData(profile);
        setHostelData(hostel);

        const info = profile?.generalinformation;
        const hostelInfo = hostel?.presenthosteldetail;

        if (info?.registrationno && info?.studentname && info?.studentcellno) {
          const qrPayload = {
            name: info.studentname,
            enrollment: info.registrationno,
            hostel: hostelInfo?.hosteldescription || "Day Scholar",
            room: hostelInfo?.allotedroomno || "N/A",
            contact: info.studentcellno,
            college: info.collegedescription || "JIIT" // Adding college info to QR
          };

          const qrString = JSON.stringify(qrPayload);
          const qr = await QRCode.toDataURL(qrString);
          setQrCode(qr);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [w]);

  

  const info = profileData?.generalinformation || {};
  const hostel = hostelData?.presenthosteldetail || {};
  const base64Photo = profileData?.["photo&signature"]?.photo || null;
  const photoSrc = base64Photo ? `data:image/jpeg;base64,${base64Photo}` : null;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center p-5">
      <h2 className="text-2xl font-semibold text-center mt-1 tracking-wide">
        IDENTITY CARD
      </h2>

      {/* ID Card */}
      <div className="bg-[#F8F8F8] rounded-2xl w-full sm:w-96 p-2 relative shadow-lg border border-white/10 mt-6">
        <div className="flex justify-between items-center text-xs px-1 text-gray-400">
          <div className="absolute left-4 top-3 text-black font-semibold text-sm">
            <p>{info.programcode} {info.branch}</p>
            <p>{info.semester} SEM</p>
          </div>

          {/* Profile Image */}
          <div className="ml-26 mt-3">
            {photoSrc && (
              <img
                src={photoSrc}
                alt="Profile"
                className="w-28 h-30 rounded-2xl object-cover"
              />
            )}
          </div>

          <div className="absolute right-4 top-3 text-black font-semibold">
            <p>ACADEMIC</p>
            <p>YEAR {info.academicyear || "----"}</p>
          </div>
        </div>

        {/* Name & Hostel Info */}
        <div className="text-center mt-2">
          <h3 className="font-bold text-md text-black">{info.studentname || "JIIT STUDENT"}</h3>
          <p className="text-sm text-gray-400">{hostel.hosteldescription || "DAY SCHOLAR"}@{hostel.allotedroomno || " "}</p>
        </div>

        {/* Yellow Box */}
        <div className="bg-[#E1FF01] text-black mt-5 rounded-md w-full p-3 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start gap-2">
              <p className="text-xs font-semibold leading-tight">{info.collegedescription || "JAYPEE INSTITUTE OF"}<br />INFORMATION AND<br />TECHNOLOGY</p>
              <div className="w-28 h-28 bg-[#E1FF01] rounded-2xl border border-black flex items-center justify-center">
                {qrCode ? (
                  <img src={qrCode} alt="QR Code" className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  <span className="text-sm">QR loading...</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-1 text-left mr-3">
              <div>
                <span className="text-xs font-semibold">Enrollment</span><br />
                <span className="text-lg font-bold">{info.registrationno || "-----"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold">Batch</span><br />
                <span className="text-lg font-bold">{info.batch || "-----"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold">Contact</span><br />
                <span className="text-lg font-bold">{info.studentcellno || "-----"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
