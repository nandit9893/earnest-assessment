"use client";
import React from "react";

type TableSkeletonProps = {
  showHeader?: boolean;
};

const TableSkeleton = ({ showHeader }: TableSkeletonProps) => {
  return (
    <div className="w-full h-full overflow-x-auto border dark:border-gray-600 border-gray-300 rounded-md">
      <table className="w-full whitespace-nowrap">
        {showHeader && (
          <thead className="border-b-2 border-gray-300 dark:border-gray-600 w-full">
            <tr className="w-full bg-white dark:bg-[#0b1739]">
              <th className="py-4 px-8 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"></div>
              </th>
              <th className="py-4 px-8 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20 mx-auto"></div>
              </th>
              <th className="py-4 px-8 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mx-auto"></div>
              </th>
              <th className="py-4 px-8 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mx-auto"></div>
              </th>
              <th className="py-4 px-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mx-auto"></div>
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {[1, 2, 3, 4, 5].map((item) => (
            <tr
              key={item}
              className={`${item % 2 === 0 ? "bg-gray-100 dark:bg-[#081028]" : "bg-white dark:bg-[#0b1739]"}`}
            >
              <td className="py-3 px-5 text-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mx-auto"></div>
              </td>
              <td className="py-3 px-5 text-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28 mx-auto"></div>
              </td>
              <td className="py-3 px-5 text-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-36 mx-auto"></div>
              </td>
              <td className="py-3 px-5 text-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-36 mx-auto"></div>
              </td>
              <td className="py-3 px-4 text-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12 mx-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
