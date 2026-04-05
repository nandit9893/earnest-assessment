"use client";
import React from "react";

const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#0b1739] border dark:border-gray-600 border-gray-300 rounded-md px-6 py-3">
      <div className="flex justify-between w-full items-center">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
      </div>
      <div className="w-full flex justify-between mt-4">
        <div className="flex flex-col gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          <div className="flex gap-3">
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;