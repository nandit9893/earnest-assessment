"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Header from "./@header/Header";
import SideBar from "./@sidebar/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);

  useEffect(() => {
    if (!user?.accessToken) {
      router.replace("/login");
    }
  }, [user, router]);


  useEffect(() => {
    if (isLeftSideBarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLeftSideBarOpen]);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <div className="hidden md:block w-60 h-full border-r border-gray-300 dark:border-gray-600">
        <SideBar
          isLeftSideBarOpen={isLeftSideBarOpen}
          setIsLeftSideBarOpen={setIsLeftSideBarOpen}
        />
      </div>
      
      {isLeftSideBarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsLeftSideBarOpen(false)}
        />
      )}
      
      <div className={`
        fixed top-0 left-0 h-full z-50 md:hidden
        transition-transform duration-300 ease-in-out
        ${isLeftSideBarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SideBar
          isLeftSideBarOpen={isLeftSideBarOpen}
          setIsLeftSideBarOpen={setIsLeftSideBarOpen}
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full w-full min-w-0">
        <div className="py-2 w-full border-b border-gray-300 dark:border-gray-600 px-2 md:px-10 h-fit md:h-24 bg-white dark:bg-[#081028]">
          <Header
            isLeftSideBarOpen={isLeftSideBarOpen}
            setIsLeftSideBarOpen={setIsLeftSideBarOpen}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-2 md:p-10 bg-[#F9FAFB] dark:bg-[#081028] custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}