"use client";
import Image from "next/image"

export default function Blueloading() {
  return (
    <div className="flex items-center justify-center h-full">
      <Image
        src="/img/Spinner.svg"
        alt=""
        width={100}
        height={100}
        priority={true}
      />
    </div>
  );
}
