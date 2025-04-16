import React from "react";

export default function CourseCard(props) {
  return (
    <div className="w-full shadow relative">
      <div className="size-20 overflow-hidden absolute bottom-26 right-4">
        <img
          className="w-full rounded"
          src={props.imgKecil}
          alt=""
        />
      </div>
      <div className="h-40 overflow-hidden">
        <img
          className="w-full -mt-20"
          src={props.imgBesar}
          alt=""
        />
      </div>
      <div className="p-4">
        <div className="title-course">
          <h1 className="text-xl">{props.title}</h1>
        </div>
        <div className="desc-course text-md">
          <p className="mt-1 text-gray-700">{props.desc}</p>
        </div>
        <div className="button-course mt-4">
          <a href={props.href} className="btn btn-primary">
            Lihat Course
          </a>
        </div>
      </div>
    </div>
  );
}
