import React, { useState, useEffect, useRef } from 'react';

export default function Guard() {
  const [form, setForm] = useState({
    enrollment: '',
    name: '',
    hostel: '',
    room: '',
    contact: '',
    gate: 'gate1',
    type: 'Entry',  // Default to Entry
  });
  const [entries, setEntries] = useState([]);
  const [fetching, setFetching] = useState(true);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [qrText, setQrText] = useState('');

  useEffect(() => {
    // load existing entries from localStorage
    const saved = localStorage.getItem('guardEntries');
    if (saved) setEntries(JSON.parse(saved));
    setFetching(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('guardEntries', JSON.stringify(entries));
  }, [entries]);

  // Watch for QR text changes and parse them
  useEffect(() => {
    if (qrText) {
      console.log('QR Text received:', qrText);
      parseQr();
    }
  }, [qrText]);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch (e) {}
        scannerRef.current = null;
      }
    };
  }, []);

  const parseQr = () => {
    if (!qrText) return;
    console.log('Parsing QR text:', qrText);
    
    try {
      // try JSON payload first
      const payload = JSON.parse(qrText);
      console.log('Successfully parsed JSON:', payload);
      
      const updatedForm = {
        enrollment: payload.enrollment || payload.enrolment || payload.registrationno || payload.registration || '',
        name: payload.name || payload.studentname || '',
        hostel: payload.hostel || payload.hostelname || '',
        room: payload.room || payload.allotedroomno || '',
        contact: payload.contact || payload.studentcellno || '',
        gate: form.gate,
        type: form.type
      };
      
      console.log('Updating form with:', updatedForm);
      setForm(updatedForm);
      
      // Submit after a brief delay to ensure state is updated
      setTimeout(() => handleSubmit(new Event('submit')), 500);
      return;
    } catch (e) {
      console.log('JSON parse failed, trying CSV format');
      // fallback: try comma-separated values: enrollment,name,hostel,room,contact
      const parts = qrText.split(',').map((p) => p.trim());
      console.log('CSV parts:', parts);
      
      const updatedForm = {
        ...form,
        enrollment: parts[0] || '',
        name: parts.length >= 2 ? parts[1] : '',
        hostel: parts.length >= 3 ? parts[2] : '',
        room: parts.length >= 4 ? parts[3] : '',
        contact: parts.length >= 5 ? parts[4] : ''
      };
      
      console.log('Updating form with CSV data:', updatedForm);
      setForm(updatedForm);
      
      // Submit after a brief delay to ensure state is updated
      setTimeout(() => handleSubmit(new Event('submit')), 500);
    }
  };

  // Webcam / QR-scanner integration (uses qr-scanner library via CDN)
  const loadQrScanner = async () => {
    const url = 'https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.min.js';
    const workerUrl = 'https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner-worker.min.js';

    // First try dynamic ESM import (works when CDN serves ESM)
    try {
      const mod = await import(/* @vite-ignore */ url);
      const ctor = mod && (mod.default || mod.QrScanner || mod);
      if (ctor) {
        ctor.WORKER_PATH = workerUrl;
        // attach to window for backward compatibility
        window.QrScanner = ctor;
        return ctor;
      }
    } catch (e) {
      // ignore and fall back to script injection
      console.debug('Dynamic import failed, falling back to script:', e);
    }

    // Fallback: inject a non-module script and wait for it to attach to window
    return new Promise((resolve, reject) => {
      if (window.QrScanner) {
        const ctor = window.QrScanner.default ? window.QrScanner.default : window.QrScanner;
        ctor.WORKER_PATH = workerUrl;
        return resolve(ctor);
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        // sometimes the script exports a default property or attaches directly
        const raw = window.QrScanner || (window.QrScanner && window.QrScanner.default);
        const ctor = window.QrScanner && window.QrScanner.default ? window.QrScanner.default : window.QrScanner;
        if (ctor) {
          ctor.WORKER_PATH = workerUrl;
          window.QrScanner = ctor;
          resolve(ctor);
        } else {
          // try to read from global again a tick later
          setTimeout(() => {
            const ctor2 = window.QrScanner && window.QrScanner.default ? window.QrScanner.default : window.QrScanner;
            if (ctor2) {
              ctor2.WORKER_PATH = workerUrl;
              window.QrScanner = ctor2;
              resolve(ctor2);
            } else {
              reject(new Error('QrScanner not available after script load'));
            }
          }, 50);
        }
      };
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  };

  const startCamera = async () => {
    if (scanning) return;
    setScanning(true);
    try {
      const QrScannerCtor = await loadQrScanner();
      if (!videoRef.current) throw new Error('Video element missing');

      // stop previous scanner if any
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch (e) {}
        scannerRef.current = null;
      }

      // create scanner using the resolved constructor
      scannerRef.current = new QrScannerCtor(
        videoRef.current,
        (result) => {
          if (result && result.data) {
            console.log('QR code detected:', result.data);
            setQrText(result.data);
            stopCamera();
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
          preferredCamera: 'environment'
        }
      );

      await scannerRef.current.start();
    } catch (err) {
      console.error('Failed to start camera/scanner', err);
      alert('Could not start camera. Please grant camera permission or try pasting QR payload.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (scannerRef.current) {
      try { scannerRef.current.stop(); } catch (e) {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!form.enrollment) return;

    const newEntry = {
      id: Date.now().toString(),
      enrollment: form.enrollment,
      name: form.name || 'N/A',
      hostel: form.hostel || 'N/A',
      room: form.room || 'N/A',
      contact: form.contact || 'N/A',
      gate: form.gate,
      type: form.type || 'Entry',
      time: new Date().toLocaleString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    // clear qrText and keep form for convenience
    setQrText('');
  };

  const exportCsv = () => {
    if (!entries || entries.length === 0) return alert('No entries to export');

    const headers = ['S.NO', 'Enrollment', 'Name', 'Hostel', 'Room', 'Contact', 'Gate', 'Time', 'Type'];
    const rows = entries.map((r, idx) => [idx + 1, r.enrollment, r.name, r.hostel, r.room, r.contact, r.gate, r.time, r.type]);

    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guard_entries_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const clearEntries = () => {
    if (!confirm('Clear all saved entries?')) return;
    setEntries([]);
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">InOut Register</h1>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="bg-[#E1FF01] text-black px-3 py-1 rounded font-semibold">Export</button>
          <button onClick={clearEntries} className="bg-gray-700 text-white px-3 py-1 rounded">Clear</button>
        </div>
      </div>

      {/* Camera preview area at top */}
      <div className="mb-6 flex flex-col items-center justify-center bg-[#111] rounded-lg p-4">
        <div className="relative">
          <video
            ref={videoRef}
            className={`rounded-lg border-2 ${scanning ? 'border-yellow-300' : 'border-gray-600'} ${scanning ? 'block w-96 h-72' : 'hidden'}`}
            muted
            playsInline
          />
          {!scanning && (
            <div className="text-center p-4">
              <button
                onClick={startCamera}
                className="bg-[#E1FF01] text-black px-6 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors"
              >
                Start Scanning
              </button>
            </div>
          )}
          {scanning && (
            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              aria-label="Stop scanning"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-sm text-gray-400 mt-2">
          {scanning ? 'Scanning for QR code...' : 'Click to start scanning'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Table */}
        <div className="bg-[#111] rounded-lg p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm table-auto">
              <thead>
                <tr className="bg-[#222]">
                  <th className="border px-2 py-2">S.NO</th>
                  <th className="border px-2 py-2">ENROLLMENT</th>
                  <th className="border px-2 py-2">NAME</th>
                  <th className="border px-2 py-2">HOSTEL</th>
                  <th className="border px-2 py-2">ROOM</th>
                  <th className="border px-2 py-2">CONTACT</th>
                  <th className="border px-2 py-2">GATE</th>
                  <th className="border px-2 py-2">TIME</th>
                  <th className="border px-2 py-2">TYPE</th>
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr><td colSpan={9} className="text-center py-6">Loading...</td></tr>
                ) : entries.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-6">No entries yet</td></tr>
                ) : (
                  entries.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-[#222]">
                      <td className="border px-2 py-2 text-center">{idx + 1}</td>
                      <td className="border px-2 py-2">{r.enrollment}</td>
                      <td className="border px-2 py-2">{r.name}</td>
                      <td className="border px-2 py-2">{r.hostel}</td>
                      <td className="border px-2 py-2">{r.room}</td>
                      <td className="border px-2 py-2">{r.contact}</td>
                      <td className="border px-2 py-2">{r.gate}</td>
                      <td className="border px-2 py-2">{r.time}</td>
                      <td className="border px-2 py-2">{r.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Preview Form */}
        <div className="bg-[#111] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Last Scanned Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Enrollment</label>
              <input name="enrollment" value={form.enrollment} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-[#0f0f0f] border border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-[#0f0f0f] border border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Hostel</label>
              <input name="hostel" value={form.hostel} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-[#0f0f0f] border border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Room</label>
              <input name="room" value={form.room} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-[#0f0f0f] border border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Contact</label>
              <input name="contact" value={form.contact} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-[#0f0f0f] border border-gray-700" />
            </div>

            <div>
              <label className="text-sm text-gray-300">Gate</label>
              <select name="gate" value={form.gate} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-[#0f0f0f] border border-gray-700">
                <option value="gate1">Gate 1</option>
                <option value="gate2">Gate 2</option>
                <option value="gate3">Gate 3</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-[#0f0f0f] border border-gray-700">
                <option value="Entry">Entry</option>
                <option value="Exit">Exit</option>
              </select>
            </div>

            <div className="mt-4">
              <button type="submit" className="w-full bg-[#E1FF01] text-black px-4 py-2 rounded font-semibold">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}