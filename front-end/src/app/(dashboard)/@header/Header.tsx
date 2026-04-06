"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Moon, SunDim } from "lucide-react";
import { getInitials } from "@/Utils/Helper";
import { SideBarProps } from "@/types";
import Image from "next/image";
import { logoutSuccess } from "@/Redux/User/UserSlice";

const Header: React.FC<SideBarProps> = ({setIsLeftSideBarOpen}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: { user: any }) => state.user);
  const path = usePathname(); 
  const pageName = path.split("/")[1].charAt(0).toUpperCase() + path.split("/")[1].slice(1);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [openProfile, setOpenProilfe] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

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

  const logut = () => {
    dispatch(logoutSuccess());
    router.push("/login")
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProilfe(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="flex gap-5 items-center relative" ref={profileRef}>
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
        <button type="button" disabled={user?.loading} onClick={()=>setOpenProilfe((prev) => !prev)} className="flex shadow cursor-pointer rounded-sm py-1 px-2 bg-[#F9FAFB] items-center dark:bg-[#0B1739]">
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
          <div className="md:flex hidden items-start flex-col px-3 py-1">
            <p className="text-[16px] leading-6.5 text-black dark:text-white font-medium">{user?.currentUser?.firstName} {user?.currentUser?.lastName}</p>
            <p className="text-gray-500 dark:text-white text-[13px] leading-5.75 font-medium">{user?.currentUser?.email}</p>
          </div>
        </button>
        {
          openProfile && (
            <div className="absolute flex flex-col gap-2 w-fit right-0 z-20 bg-white px-3 top-11 md:top-16 py-1 rounded-md shadow border border-gray-200 dark:border-gray-600 cursor-pointer transition-colors dark:bg-[#081028]">
              <button onClick={logut} type="button" disabled={user?.loading} className="text-[14px] cursor-pointer leading-6 text-black dark:text-white font-normal">Logout</button>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Header;