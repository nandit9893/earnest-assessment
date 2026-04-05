"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { Menu, Moon, SunDim } from "lucide-react";
import { getInitials } from "@/Utils/Helper";
import { SideBarProps } from "@/types";
import Image from "next/image";

const Header: React.FC<SideBarProps> = ({setIsLeftSideBarOpen}) => {
  const user = useSelector((state: { user: any }) => state.user);
  const path = usePathname(); 
  const pageName = path.split("/")[1].charAt(0).toUpperCase() + path.split("/")[1].slice(1);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="flex justify-between w-full items-center h-full">
      <div className="hidden md:flex flex-col h-full w-full">
        <p className="text-[24px] leading-8.5 dark:text-gray-300 text-black font-medium">{pageName}</p>
        <div className="flex gap-1 items-center">
          <p className="text-gray-500 dark:text-gray-200 text-[14px] leading-6 font-medium">Welcome back,</p>
          <p className="text-black dark:text-white text-[18px] leading-7 font-semibold">{user?.currentUser?.role?.roleType}</p>
        </div>
      </div>
      <button type="button" disabled={user?.loading} className="w-8 h-8 md:hidden flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md cursor-pointer transition-colors duration-300 justify-center" onClick={() => setIsLeftSideBarOpen(true)}>
        <Menu className="w-6 h-6 text-black dark:text-white" />
      </button>
      <div className="flex gap-5 items-center">
        <div onClick={() => setDarkMode(!darkMode)} className="flex items-center justify-center cursor-pointer">
          {
            darkMode ? 
            (
              <SunDim className="w-5 h-5 text-[#EAB308] fill-current" />
            )
            :
            (
              <Moon className="w-5 h-5 text-black fill-current" />
            )
          }
        </div>
        <div className="flex shadow rounded-sm p-1 bg-[#F9FAFB] items-center dark:bg-[#081028]">
          <div className="w-8 h-8 rounded-full flex items-center justify-center dark:border-gray-700 border border-gray-300">
            {
              user?.currentUser?.imageURL && user?.currentUser?.imageURL?.trim() !== "" ?
              (
                <Image src={user?.currentUser?.imageURL} alt={user?.currentUser?.firstName || "Website Logo"} width={500} height={500} priority className="w-full object-contain" quality={100} />
              )
              :
              (
                <p className="text-[14px] leading-6 text-black dark:text-white font-medium">{getInitials(user?.currentUser?.firstName, user?.currentUser?.lastName)}</p>
              )
            }
          </div>
          <div className="md:flex hidden flex-col px-3 py-1">
            <p className="text-[16px] leading-6.5 text-black dark:text-white font-medium">{user?.currentUser?.firstName} {user?.currentUser?.lastName}</p>
            <p className="text-gray-500 dark:text-white text-[13px] leading-5.75 font-medium">{user?.currentUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;