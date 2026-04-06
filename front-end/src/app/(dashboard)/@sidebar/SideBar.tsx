"use client";
import React, { useEffect, useState } from "react";
import { logoutSuccess, setModuleID } from "@/Redux/User/UserSlice";
import { sideBarModules } from "@/Utils/API/module";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import * as Icons from "lucide-react";
import { getWebsite } from "@/Utils/GraphQL/Graph";
import { GetWebsiteQueryResult, SideBarProps } from "@/types";
import SideBarSkeleton from "@/Skelton/SideBarSkeleton";
import { useRouter, usePathname } from "next/navigation";

const SideBar: React.FC<SideBarProps> = ({setIsLeftSideBarOpen, isLeftSideBarOpen}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: { user: any }) => state.user);
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data, loading, error } = useQuery<GetWebsiteQueryResult>(getWebsite);
  
  const getIconByID = (iconName: string) => {
    if (!iconName) return null;
    const IconKey = iconName as keyof typeof Icons;
    const IconComponent = Icons[IconKey];
    return IconComponent || null;
  };

  const changeSidebarModule = (id: string) => {
    dispatch(setModuleID(id));
    if (window.innerWidth < 768 && setIsLeftSideBarOpen) {
      setIsLeftSideBarOpen(false);
    }
  };

  const logut = () => {
    dispatch(logoutSuccess());
    router.push("/login")
  };

  useEffect(() => {
    if (!user?.currentUser || !user?.accessToken) return;
    let isMounted = true;
    const fetchSidebar = async () => {
      setIsLoading(true);
      const result = await sideBarModules(user.accessToken);
      if (!isMounted) return;
      if (result?.success && result?.data?.length > 0) {
        const userModuleIds = user?.currentUser?.modules.map((m: any) => m._id);
        const filteredModules = result?.data?.filter((mod: any) =>  userModuleIds?.includes(mod?._id));
        const dashboardModule = filteredModules?.find((mod: any) => mod?.slug === "dashboard");
        dispatch(setModuleID(dashboardModule?._id));
        setModules(filteredModules);
      }
      setIsLoading(false);
    };
    fetchSidebar();
    return () => {
      isMounted = false;
    };
  }, [user?.currentUser, user?.accessToken]);

  useEffect(() => {
    if (!modules?.length) return;
    const allowedSlugs = modules.map((mod: any) => `/${mod?.slug}`);
    if (!allowedSlugs.includes(pathname)) {
      router.push("/not-found");
    }
  }, [pathname, modules]);

  if(isLoading) {
    return <SideBarSkeleton />
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#081028]">

      <div className="hidden md:flex flex-col gap-2 w-full">
        <div className="py-1 flex items-center justify-center w-32">
          {
            data?.website?.logo && (
              <Image src={data?.website?.logo} alt={data?.website?.title || "Website Logo"} width={150} height={150} priority className="w-24" quality={100} />
            )
          }
        </div>
        <div className="w-full h-px dark:bg-gray-600 bg-gray-300" />
        <div className="flex flex-col gap-2 items-center px-2">
          {
            modules?.length > 0 && modules?.map((module: any) => {
              const IconComponent = getIconByID(module?.iconName) as any;
              if (!IconComponent) return null;
              return (
                <Link href={module?.slug} key={module?._id} onClick={() => changeSidebarModule(module?._id)} className={`flex gap-3 border-none outline-none cursor-pointer items-center w-full py-1 rounded-md px-5 overflow-hidden transition-all duration-300 ${user?.currentModule  === module?._id ? "border-l-4 border-solid border-[#7b57e0] bg-[#f3f2fc] dark:bg-[#0b1739] dark:text-white text-[#7b57e0] font-medium" : "dark:hover:bg-[#7b57e0] hover:bg-gray-200 dark:text-white text-black font-normal"} hover:border-sky-500 dark:hover:border-white hover:text-sky-500 dark:hover:text-white hover:translate-x-1`}>
                  <div className="w-6 h-6 flex items-center justify-center">
                    {IconComponent && <IconComponent className={`w-full h-full ${user?.currentModule  === module?._id ? "fill-current": "fill-none" }`} />}
                  </div>
                  <p className={`text-[14px] leading-6 text-left w-full`}>{module?.moduleName}</p>
                </Link>
              )
            })
          } 
        </div>
      </div>

      {
        isLeftSideBarOpen && (
          <div className="flex flex-col h-full w-64 bg-white dark:bg-[#081028] md:hidden">
            <div className="flex justify-between w-full items-center h-20 border-b border-gray-300 dark:border-gray-700">
              <div className="px-2 py-2">
                {
                  data?.website?.logo && (
                    <Image src={data?.website?.logo} alt={data?.website?.title || "Website Logo"} width={150} height={150} priority className="w-20" quality={100} />
                  )
                }
              </div>
              <div className="w-12 h-12 md:hidden flex items-center justify-center cursor-pointer" onClick={()=>setIsLeftSideBarOpen(false)}>
                <Icons.X className="w-7 h-7 text-[#9CA3AF] dark:text-[#0EA5E9] transition-all hover:text-black dark:hover:text-white duration-300 hover:rotate-180" />
              </div>
            </div>
            {
              modules?.length > 0 && modules?.map((module: any) => {
                const IconComponent = getIconByID(module?.iconName) as any;
                if (!IconComponent) return null;
                return (
                  <Link href={module?.slug} key={module?._id} onClick={() => changeSidebarModule(module?._id)} className={`flex gap-3 border-none outline-none cursor-pointer items-center w-full py-1 rounded-md px-5 overflow-hidden transition-all duration-300 ${user?.currentModule  === module?._id ? "border-l-4 border-solid border-[#7b57e0] bg-[#f3f2fc] dark:bg-[#0b1739] dark:text-white text-[#7b57e0] font-semibold" : "dark:hover:bg-[#7b57e0] hover:bg-gray-200 dark:text-white text-black font-medium"} hover:border-sky-500 dark:hover:border-white hover:text-sky-500 dark:hover:text-white hover:translate-x-1`}>
                    <div className="w-6 h-6 flex items-center justify-center">
                      {IconComponent && <IconComponent className={`w-full h-full ${user?.currentModule  === module?._id ? "fill-current": "fill-none" }`} />}
                    </div>
                    <p className={`text-[14px] leading-6 text-left w-full`}>{module?.moduleName}</p>
                  </Link>
                )
              })
            }
          </div>
        )
      }
    </div>
  );
};

export default SideBar;