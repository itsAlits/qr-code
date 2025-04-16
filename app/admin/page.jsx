"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/kehadiran");

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data = await response.json();
        console.log(data);
        setAttendanceData(data);
        setFilteredData(data);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  // Function to format date string
  const formatDateString = (dateString) => {
    if (!dateString) return "N/A";

    try {
      // Assuming dateString is in format "2025-04-16T14:51:44.000Z" or similar
      // Extract parts directly without converting to Date object
      const parts = dateString.split("T");

      if (parts.length !== 2) return dateString; // Return original if not in expected format

      const datePart = parts[0];
      const timePart = parts[1].split(".")[0]; // Remove milliseconds

      // Reformat date from YYYY-MM-DD to DD/MM/YYYY
      const datePieces = datePart.split("-");
      if (datePieces.length !== 3) return dateString; // Return original if not in expected format

      const formattedDate = `${datePieces[2]}/${datePieces[1]}/${datePieces[0]}`;

      // Format time (get only hours and minutes)
      const timePieces = timePart.split(":");
      const formattedTime = `${timePieces[0]}:${timePieces[1]}`;

      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      console.error("Error formatting date string:", error);
      return dateString; // Return original string if parsing fails
    }
  };

  // Get date part from ISO string for comparison (YYYY-MM-DD)
  const getDatePart = (dateString) => {
    if (!dateString) return "";

    try {
      const parts = dateString.split("T");
      return parts[0]; // Returns YYYY-MM-DD part
    } catch (error) {
      console.error("Error extracting date part:", error);
      return "";
    }
  };

  // Filter data based on date range
  const filterByDateRange = () => {
    if (!startDate && !endDate) {
      setFilteredData(attendanceData);
      return;
    }

    const filtered = attendanceData.filter((item) => {
      const itemDate = getDatePart(item.date);

      if (!itemDate) return false;

      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate >= startDate;
      } else if (endDate) {
        return itemDate <= endDate;
      }

      return true;
    });

    setFilteredData(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(attendanceData);
  };

  return (
    <div>
      <div className="shadow">
        <nav className="flex justify-between h-20 items-center container mx-auto">
          <div>
            <img
              src="https://www.pngarts.com/files/11/Google-Logo-PNG-Download-Image.png"
              alt="Logo"
              className="h-14"
            />
          </div>
          <div className="flex items-center gap-10">
            <a href="/" className="text-md hover:underline">
              Keluar
            </a>
          </div>
        </nav>
      </div>

      <div className="container mx-auto py-8">
        {/* Date Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="shadow rounded p-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div className="shadow rounded p-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={filterByDateRange}
                className="bg-blue-600 w-full hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
              >
                Terapkan Filter
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors duration-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md text-red-700">
            <p>Error: {error}</p>
            <p className="mt-2">
              Silahkan coba lagi atau hubungi administrator.
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <p className="text-yellow-700">
              Tidak ada data kehadiran yang tersedia untuk filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal & Waktu
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.User?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {item.User?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateString(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "hadir"
                            ? "bg-green-100 text-green-800"
                            : item.status === "izin"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "sakit"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "hadir"
                          ? "Hadir"
                          : item.status === "izin"
                          ? "Izin"
                          : item.status === "sakit"
                          ? "Sakit"
                          : "Tidak Hadir"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
