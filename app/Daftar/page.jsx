"use client";
import React, { useState } from "react";
import { QRCode } from "react-qr-code";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQRData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Generate QR code data
      const qrContent = {
        name: formData.name,
        email: formData.email,
        registeredAt: new Date().toISOString(),
        userId: data.id, // Assuming the backend returns a user ID
      };

      // Show QR code and hide form
      setShowQR(true);
      setQRData(JSON.stringify(qrContent));

      // Show success toast
      toast.success("Pendaftaran Berhasil.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error:", error);
      // Show error toast
      toast.error(error.message || "Pendaftaran Gagal, Coba Lagi.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <ToastContainer />
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              {!showQR ? (
                <form
                  className="space-y-4 md:space-y-3"
                  onSubmit={handleSubmit}
                >
                  <div className="flex gap-2">
                    <div className="w-full">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nama
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Masukan Nama"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Masukan Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full mt-2 btn btn-primary">
                    Create an account
                  </button>
                  <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                    Sudah Mempunyai Akun?{" "}
                    <a
                      href="/Login"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Login disini
                    </a>
                  </p>
                </form>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Pendaftaran Berhasil
                  </h2>
                  <p className="text-gray-600 mb-6">
                    QR Code Kamu Berhasil Di Buat:
                  </p>
                  <div className="mb-6 flex justify-center">
                    <QRCode
                      value={qrData}
                      size={256}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                    />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Simpan QR Code ini untuk proses absen nantinya
                  </p>
                  <button
                    onClick={() => {
                      setShowQR(false);
                      setFormData({ name: "", email: "", password: "" });
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Daftar Akun Lainnya
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
