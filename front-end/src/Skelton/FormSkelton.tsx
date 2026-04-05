"use client";
import React from "react";

const FormSkeleton = () => {
  return (
    <div className="w-full h-full animate-pulse">
      {/* Header Section */}
      <div className="flex justify-between w-full items-center px-5 pt-3 pb-1">
        <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />
      
      {/* Form Fields Grid */}
      <div className="w-full flex flex-col gap-2 px-4 py-5 h-full overflow-y-auto">
        <div className="grid grid-cols-2 w-full gap-x-8 gap-y-4">
          {/* Task Name Field */}
          <div className="flex flex-col gap-2 w-full">
            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          
          {/* Status Field */}
          <div className="flex flex-col gap-2 w-full">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          
          {/* Start Date Field */}
          <div className="flex flex-col gap-2 w-full">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          
          {/* Completed Date Field */}
          <div className="flex flex-col gap-2 w-full">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          
          {/* Employee Dropdown Field */}
          <div className="flex flex-col gap-2 w-full">
            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
        
        {/* Description Field - Full Width */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-5 w-full mt-4 items-center">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;