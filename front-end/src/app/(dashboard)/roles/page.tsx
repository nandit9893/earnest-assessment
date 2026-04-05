"use client";
import React, { useEffect, useState } from "react";
import { getModuleFields } from "@/Utils/API/module";
import { getRoles } from "@/Utils/API/role";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import TableSkeleton from "@/Skelton/TableSkeleton";

const Page = () => {
  const user = useSelector((state: { user: any }) => state.user);
  const [columns, setColumns] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const path = usePathname(); 
  const pageName = path.split("/")[1].charAt(0).toUpperCase() + path.split("/")[1].slice(1);

  const fetchData = async () => {
      setLoading(true);
      const columnsResponse = await getModuleFields(
        user?.accessToken,
        user?.currentModule,
        true,
      );
      if (columnsResponse?.success) {
        setColumns(columnsResponse.data || []);
      }
      const rolesResponse = await getRoles(user?.accessToken);
      if (rolesResponse?.success) {
        setRoles(rolesResponse.data || []);
      }
      setLoading(false);
  };

  useEffect(() => {
    if (!user?.accessToken || !user?.currentModule) return;
    fetchData();
  }, [user?.accessToken, user?.currentModule]);

  if(loading) {
    return <TableSkeleton showHeader={true} />
  };

  return (
    <div className="flex flex-col w-full h-full gap-3">
      {
        user?.currentUser?.role?.permissions?.includes("Read") && (
          <div className="w-full flex justify-between items-center bg-white dark:bg-[#0b1739] border dark:border-gray-600 border-gray-300 rounded-xl px-6 py-3">
            <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">{pageName} List ({roles?.length})</p>
          </div>
        )
      }
      <div className="w-full h-full overflow-x-auto border dark:border-gray-600 border-gray-300 rounded-xl">
        <table className="w-full whitespace-nowrap">
          <thead className="border-b-2 border-gray-300 dark:border-gray-600 w-full">
            <tr className="w-full bg-white dark:bg-[#0b1739]">
              {
                columns?.map((header) => (
                  <th key={header?._id} className="py-4 px-8 whitespace-nowrap">
                    <span className="text-[14px] text-center leading-6 text-[#334155] dark:text-white font-medium">{header?.fieldLabel}</span>
                  </th>
                ))
              }
              {
                user?.currentUser?.role?.permissions?.length > 0 && (
                  <th className="py-4 px-4 whitespace-nowrap">
                    <span className="text-[14px] leading-6 text-[#334155] dark:text-white font-medium">Action</span>
                  </th>
                )
              }
            </tr>
          </thead>
          <tbody>
            {
              roles?.length > 0 && roles?.map?.((role, index) => (
                <tr key={role?._id} className={`transition-all duration-300 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black cursor-pointer hover:-translate-y-px ${index % 2 === 0 ? "bg-gray-100 dark:bg-[#081028]" : "bg-white dark:bg-[#0b1739]"}`}>
                  <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{role?.roleType}</td>
                  <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{role?.permissions?.join(" ")}</td>
                  <td className="py-1.5 px-4 whitespace-nowrap">
                    <div className="flex gap-2 items-center justify-center">
                      {
                        user?.currentUser?.role?.permissions?.includes("Update") && (
                          <button className="border cursor-pointer font-medium dark:border-gray-600 border-gray-300 rounded-md text-black hover:text-white dark:text-white text-[12px] leading-5.5 px-2 py-0.5 transition-all hover:bg-[#7b57e0] dark:hover:bg-sky-500">Edit</button>
                        )
                      }
                      {
                        user?.currentUser?.role?.permissions?.includes("Delete") && (
                          <button className="border cursor-pointer font-medium dark:border-gray-600 border-gray-300 rounded-md text-black hover:text-white dark:text-white text-[12px] leading-5.5 px-2 py-0.5 transition-all hover:bg-[#7b57e0] dark:hover:bg-sky-500">Delete</button>
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;