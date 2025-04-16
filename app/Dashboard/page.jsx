"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../Components/CourseCard";

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get email from localStorage
        const storedUser = localStorage.getItem("currentUser");

        if (!storedUser) {
          throw new Error("User not logged in");
        }

        const { email } = JSON.parse(storedUser);

        // Fetch user data using the email
        const response = await fetch(
          `http://localhost:8000/api/users/${email}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div>
      {/* nav user yang login */}
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
            <a href="/Absen" className="text-md hover:underline">
              Absensi
            </a>
            <a href="/" className="text-md hover:underline">
              Keluar
            </a>
          </div>
        </nav>
      </div>
      {/* course card */}

      <main className="my-10 container mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <h1 className="text-2xl">Hi, {user?.name || "User"}</h1>
            <div className="mt-6 grid grid-cols-3 gap-6">
              <CourseCard
                title="Matematika"
                imgKecil="https://media.istockphoto.com/id/539025928/id/vektor/latar-belakang-ikon-matematika.jpg?s=612x612&w=0&k=20&c=4zqwyg6-gAVQr_fTi2TbFBKNfWkwOV7Qb_wcFunmyK4="
                imgBesar="https://asset.kompas.com/crops/FiYyvGqh8sQprNmnzcQkxZQaIKI=/0x0:3000x2000/1200x800/data/photo/2023/09/07/64f97efc911da.jpg"
                desc="Matematika Kelas 12 Mipa 6"
              />
              <CourseCard
                title="Chemistry"
                imgKecil="https://play-lh.googleusercontent.com/TEOcegkxhKk5PrKXGfAIWPXuLC1QTRQNfj-mGz4VqDWKhQz1yj8sOeJsx-snpoD23R4"
                imgBesar="https://www.euroschoolindia.com/blogs/wp-content/uploads/2024/01/why-is-chemistry-important-jpg.webp"
                desc="Chemistry Kelas 12 Mipa 6"
              />
              <CourseCard
                title="Fisika"
                imgKecil="https://media.istockphoto.com/id/615915320/id/vektor/ilustrasi-fisika.jpg?s=612x612&w=0&k=20&c=84Gw-MD1qUyYr7zM12vjxfbUP6T2zhMlKn_zIyk_vDw="
                imgBesar="https://pochemychki.com.ua/wp-content/uploads/2025/01/1-1-46.webp"
                desc="Fisika Kelas 12 Mipa 6"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
