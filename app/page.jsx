"use client";

// import { Qrreader } from "./Components/Qrreader";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <img
          src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs3/133987017/original/c43bd711b70fab6470ab7c648126b30916c975ad/draw-amazing-doodle-art-cartoon-on-your-logo.jpg"
          alt="Logo"
          className="h-40 mb-6"
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
