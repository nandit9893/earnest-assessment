"use client";
import React from "react";

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
);

const SideBarSkeleton = () => {
  const skeletonItems = [1, 2, 3, 4, 5];

  return (
    <div className="w-full h-full bg-white dark:bg-[#081028] relative overflow-hidden">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden md:flex flex-col gap-2 w-full">
        {/* Logo Skeleton */}
        <div className="py-1 flex items-center justify-center w-32 relative overflow-hidden">
          <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <Shimmer />
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
        
        {/* Module Items Skeleton */}
        {skeletonItems.map((item) => (
          <div
            key={item}
            className="flex gap-3 items-center w-full py-1 rounded-md px-5 relative overflow-hidden"
          >
            {/* Icon Skeleton */}
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md" />
            
            {/* Text Skeleton */}
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24" />
            </div>
            <Shimmer />
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Skeleton */}
      <div className="flex flex-col h-full w-64 bg-white dark:bg-[#081028] md:hidden relative overflow-hidden">
        {/* Header Skeleton */}
        <div className="flex justify-between w-full items-center h-20 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden">
          {/* Logo Skeleton */}
          <div className="px-2 py-2">
            <div className="w-20 h-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
          </div>
          
          {/* Close Button Skeleton */}
          <div className="w-12 h-12 flex items-center justify-center">
            <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-md" />
          </div>
          <Shimmer />
        </div>
        
        {/* Module Items Skeleton */}
        {skeletonItems.map((item) => (
          <div
            key={item}
            className="flex gap-3 items-center w-full py-1 rounded-md px-5 relative overflow-hidden"
          >
            {/* Icon Skeleton */}
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md" />
            
            {/* Text Skeleton */}
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24" />
            </div>
            <Shimmer />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SideBarSkeleton;