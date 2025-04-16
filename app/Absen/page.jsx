"use client";
import React, { useEffect, useState } from "react";
import { Qrreader } from "../Components/Qrreader";

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
        console.log(userData);
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
    <div className="container mx-auto">
      {/* nav user yang login */}
      <nav className="flex justify-between h-20 items-center">
        <div>
          <img
            src="https://www.pngarts.com/files/11/Google-Logo-PNG-Download-Image.png"
            alt="Logo"
            className="h-14"
          />
        </div>
        <div className="flex items-center gap-10">
          <a href="/Absensi" className="text-lg text-primary underline">
            Absensi
          </a>
          {loading ? (
            <p>Loading user...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <h1 className="text-lg">Hi, {user?.name || "User"}</h1>
          )}
        </div>
      </nav>
      <main className="pt-24">
        <Qrreader user={user} />
      </main>
    </div>
  );
}