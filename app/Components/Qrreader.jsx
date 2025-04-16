"use client";
import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Qrreader = ({ user }) => {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Function to get current date in Indonesia time zone format (UTC+7)
  const getIndonesiaTime = () => {
    // Create a date object for current time
    const date = new Date();

    // Format as YYYY-MM-DD HH:MM:SS in Indonesia time (UTC+7)
    // First, get the UTC time in milliseconds
    const utcTime = date.getTime();

    // Add 7 hours (Indonesia/Jakarta is UTC+7)
    const indonesiaTime = new Date(utcTime + 7 * 60 * 60 * 1000);

    // Format as YYYY-MM-DD HH:MM:SS
    const year = indonesiaTime.getUTCFullYear();
    const month = String(indonesiaTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(indonesiaTime.getUTCDate()).padStart(2, "0");
    const hours = String(indonesiaTime.getUTCHours()).padStart(2, "0");
    const minutes = String(indonesiaTime.getUTCMinutes()).padStart(2, "0");
    const seconds = String(indonesiaTime.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleScan = async (result) => {
    console.log("Scan result received:", result);
    if (result && result[0].rawValue) {
      const rawValue = result[0].rawValue;
      console.log("Raw value:", rawValue);
      setScannedData(rawValue);

      // Check if user is available
      if (user && user.id) {
        try {
          setLoading(true);

          // Parse the QR code data (which is a JSON string)
          let qrData;
          try {
            qrData = JSON.parse(rawValue);
          } catch (parseErr) {
            throw new Error("Invalid QR code format");
          }

          // Extract userId from the QR data
          const scannedUserId = qrData.userId;

          // Compare scanned userId with current user's ID
          if (scannedUserId === user.id) {
            // User IDs match, submit attendance with Indonesia time
            const indonesiaTime = getIndonesiaTime();
            console.log("Indonesia time for attendance:", indonesiaTime);

            // Create the data object to be sent
            const attendanceData = {
              userId: user.id,
              date: indonesiaTime,
              status: "hadir",
              keterangan: "Masuk tepat waktu",
            };

            // Store the data for display
            setSubmittedData(attendanceData);

            const response = await fetch(
              "http://localhost:8000/api/kehadiran",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(attendanceData),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to submit attendance");
            }

            setSuccess("Absensi berhasil dicatat!");
            toast.success("Absensi berhasil dicatat!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });

            // Redirect after 2 seconds
            setTimeout(() => {
              window.location.href = "/Dashboard";
            }, 5000);

            setError(null);
          } else {
            setError(`QR Code tidak cocok dengan identitas pengguna`);
            toast.error(`QR Code tidak cocok dengan identitas pengguna`, {
              position: "top-right",
              autoClose: 3000,
            });
            setSuccess(null);
          }
        } catch (err) {
          console.error("Error processing attendance:", err);
          const errorMessage = err.message || "Gagal mencatat kehadiran";
          setError(errorMessage);
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 3000,
          });
          setSuccess(null);
        } finally {
          setLoading(false);
        }
      } else {
        const errorMessage = "Data pengguna tidak tersedia";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      console.log("No valid result received");
    }
  };

  const handleError = (err) => {
    console.error("Scanner error:", err);
    const errorMessage = err.message || "An error occurred";
    setError(errorMessage);
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center">Scan QR Code</h1>
          <p className="text-center">
            Scan QR Code kamu untuk melakukan absensi
          </p>
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="w-full max-w-lg h-80 md:h-96 lg:h-[520px] border border-gray-400">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                delay={300}
                facingMode="environment"
              />
            </div>
            {loading && (
              <div className="mt-4 text-blue-500 text-center">
                Memproses absensi...
              </div>
            )}
            {error && (
              <div className="mt-4 text-red-500 text-center">{error}</div>
            )}
            {success && (
              <div className="mt-4 text-green-500 text-center font-bold">
                {success}
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-100 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Data Kehadiran</h2>
          {submittedData ? (
            <div className="space-y-4">
              <div className="rounded-lg p-4 shadow bg-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">
                  Data yang dikirimkan:
                </h3>
                <table className="w-full ">
                  <tbody>
                    <tr className="">
                      <td className="py-1 font-medium">User ID:</td>
                      <td className="py-1">{submittedData.userId}</td>
                    </tr>
                    <tr className="">
                      <td className="py-1 font-medium">Tanggal & Waktu:</td>
                      <td className="py-1">{submittedData.date}</td>
                    </tr>
                    <tr className="">
                      <td className="py-1 font-medium">Status:</td>
                      <td className="py-1">{submittedData.status}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium">Keterangan:</td>
                      <td className="py-1">{submittedData.keterangan}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Data di atas telah dikirim ke server dan sedang diproses.
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Data kehadiran akan ditampilkan di sini setelah QR code berhasil
              dipindai.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
