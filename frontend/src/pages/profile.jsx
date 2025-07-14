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
            contact: info.studentcellno
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
                <p className="text-xs font-semibold leading-tight">JAYPEE INSTITUTE OF<br />INFORMATION AND<br />TECHNOLOGY</p>
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

        {/* Logs section */}
        <Logs />
    </div>
  );
}

const Logs = () => {
  const entries = [
    { type: 'in', gate: 'GATE 3', time: '02:00 PM' },
    { type: 'out', gate: 'GATE 3', time: '04:00 PM' },
    { type: 'in', gate: 'GATE 1', time: '07:00 PM' },
  ];

  return (
    <>
      <div className="block sm:hidden w-full mt-6">
        <div className="w-full bg-[#1a1a1a] rounded-2xl p-5 shadow-2xl border-t border-white/30 h-96 overflow-y-auto" style={{ boxShadow: '0 0 0 2px #fff, 0 0 0 3px #1a1a1a' }}>
          <LogHeader />
          <div className="flex flex-col gap-3 mt-2">
            {entries.map((entry, i) => <LogEntry key={i} {...entry} />)}
          </div>
        </div>
      </div>

      <div className="hidden sm:fixed sm:left-0 sm:bottom-0 sm:w-full sm:flex sm:justify-center sm:z-50">
        <div className="w-full sm:w-96 md:w-[28rem] bg-[#1a1a1a] rounded-t-2xl p-5 shadow-2xl border-t border-white/30 animate-slideup h-96 flex flex-col" style={{ boxShadow: '0 0 0 2px #fff, 0 0 0 3px #1a1a1a' }}>
          <LogHeader />
          <div className="flex flex-col gap-3 mt-2 flex-grow overflow-y-auto h-full">
            {entries.map((entry, i) => <LogEntry key={i} {...entry} />)}
          </div>
        </div>
      </div>
    </>
  );
};

const LogHeader = () => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-white">Logs</span>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="2" rx="1" fill="#fff" />
        <rect x="5" y="11" width="14" height="2" rx="1" fill="#fff" />
        <rect x="7" y="15" width="10" height="2" rx="1" fill="#fff" />
      </svg>
    </div>
    <button className="text-white hover:bg-white/10 rounded p-1" title="Copy logs">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="#fff" strokeWidth="2" />
        <rect x="3" y="3" width="13" height="13" rx="2" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeWidth="2" />
      </svg>
    </button>
  </div>
);

const LogEntry = ({ type, gate, time }) => {
  const isOut = type === 'out';
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isOut ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOut ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transform ${isOut ? 'rotate-180' : ''}`}>
            <path d="M12 2L12 22M12 2L5 9M12 2L19 9" stroke={isOut ? '#F87171' : '#4ADE80'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className={`font-semibold ${isOut ? 'text-red-400' : 'text-green-400'}`}>{gate}</span>
      </div>
      <span className="text-gray-400">{time}</span>
    </div>
  );
};
