"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center md:px-4 px-2 py-4">
      <div className="max-w-md w-full text-center bg-white rounded-md shadow-xl px-2 py-8 md:py-12 md:px-12">
        {/* Animated 404 */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-40 h-40 opacity-50">
            <Image
              src="/not-found.jpg"
              alt={"Website Logo"}
              width={500}
              height={500}
              priority
              className="w-full object-contain"
              quality={100}
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-bold text-red-500 animate-bounce">
              404
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Page Not Found
        </h1>

        {/* Go Back Button */}
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-700 duration-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
