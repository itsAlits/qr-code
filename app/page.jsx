"use client";

// import { Qrreader } from "./Components/Qrreader";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <img
          src="https://www.pngarts.com/files/11/Google-Logo-PNG-Download-Image.png"
          alt="Logo"
          className="h-32 mb-6"
        />
      </div>
      <p className="text-center">
        Learning Management System (LMS) Application Created with Next.js |
        ExpressJS
      </p>
      <p className="text-center">Made by Eka Putra</p>
      <div className="flex gap-2 mt-4">
        <a href="/Daftar" className="btn btn-primary">
          Daftar Sekarang
        </a>
        <a href="/Login" className="btn btn-success text-white">
          Masuk Sekarang
        </a>
      </div>
    </div>
  );
}
