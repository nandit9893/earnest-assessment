"use client";
import DropDown from "@/Components/Dropdown";
import { Column, EmployeeResponse } from "@/types";
import { getEmployees } from "@/Utils/API/employee";
import { getModuleFields } from "@/Utils/API/module";
import { getRoles } from "@/Utils/API/role";
import { itemsLimit } from "@/Utils/Helper";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import TableSkeleton from "@/Skelton/TableSkeleton";
import HeaderSkeleton from "@/Skelton/HeaderSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Search } from "lucide-react";
import AddEmployee from "./(.)add/page";

const Employees = () => {
  const user = useSelector((state: { user: any }) => state.user);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<EmployeeResponse | null>(null);
  const path = usePathname();
  const pageName = path.split("/")[1].charAt(0).toUpperCase() + path.split("/")[1].slice(1);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const rolesRef = useRef<HTMLDivElement | null>(null);
  const [openRoles, setOpenRoles] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [roles, setRoles] = useState([]);
  const [roleID, setRoleID] = useState("");

  const limitRef = useRef<HTMLDivElement | null>(null);
  const [openLimit, setOpenLimit] = useState(false);
  const [limit, setLimit] = useState("10");

  const [activeFilter, setActiveFilter] = useState("false");
  const [deleted, setDeleted] = useState(false);

  const [addNewEmplpoyee, setAddNewEmployee] = useState(false);

  const getFieldLabel = (fieldName: string) => {
    const data = columns?.find((col) => col?.fieldName === fieldName)?.fieldLabel;
    return `${data}`;
  };

  const selectRole = (item: any) => {
    setSelectedRoleName(item?.roleType);
    setRoleID(item?._id); 
    setOpenRoles(false);
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true); 
  };

  const selectLimit = (item: any) => {
    setLimit(item?.limit);
    setOpenLimit(false);
    setPage(1);
    setIsInitialLoading(true);
  };

  const fetchData = async () => {
    setLoading(true);
    setEmployees(null);
    setPage(1);
    setHasMore(true);
    const columnsData = await getModuleFields(user?.accessToken, user?.currentModule, true);
    if (columnsData?.success) {
      setColumns(columnsData.data || []);
    }
    const rolesData = await getRoles(user?.accessToken);
    if (rolesData?.success) {
      setRoles(rolesData.data || []);
    }
    if (columnsData?.success) {
      setColumns(columnsData.data || []);
    }
    const tasksData = await getEmployees(
      user?.accessToken,
      search,
      roleID,
      String(deleted),
      1,
      Number(limit)
    );
    if (tasksData?.success) {
      const taskResult = tasksData;
      setHasMore(taskResult?.data?.length === parseInt(limit) && taskResult?.pagination?.hasNextPage);
      setEmployees(tasksData);
    } else if (tasksData?.success === false) {
      setEmployees(null);
      setHasMore(false);
    }
    setLoading(false);
    setIsSearching(false);
    setIsInitialLoading(false);
    setHasLoadedOnce(true);
  };

  const fetchNextData = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = page + 1;
      const employeesData = await getEmployees(
        user?.accessToken,
        search,
        roleID,
        String(deleted),
        nextPage,
        Number(limit)
      );
      if (employeesData?.success && employeesData?.data?.length > 0) {
        const newEmployees = employeesData.data;
        setEmployees((prev) => {
          if (!prev) return employeesData;
          const existingIds = new Set(prev.data.map((p) => p._id));
          const uniqueNewEmployees = newEmployees.filter((p: any) => !existingIds.has(p._id));
          return {
            ...prev,
            data: [...prev.data, ...uniqueNewEmployees],
            pagination: employeesData.pagination,
          };
        });
        setPage(nextPage);
        setHasMore(employeesData?.data?.length === Number(limit) && employeesData?.pagination?.hasNextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (value.length >= 4 || value.length === 0) {
      debounceTimerRef.current = setTimeout(() => {
        setSearch(value);
        setPage(1);
        setHasMore(true);
        setIsSearching(true);
        setIsInitialLoading(true);
      }, 500);
    }
  }, []);

  const searchSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (searchInput.length >= 4 || searchInput.length === 0) {
      setSearch(searchInput);
      setPage(1);
      setHasMore(true);
      setIsSearching(true);
      setIsInitialLoading(true);
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      fetchData();
    }
  }, [user?.accessToken, user?.currentModule, deleted, limit, search, activeFilter, roleID]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openRoles && rolesRef.current && !rolesRef.current.contains(e.target as Node)) {
        setOpenRoles(false);
      }
      if (openLimit && limitRef.current && !limitRef.current.contains(e.target as Node)) {
        setOpenLimit(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openRoles, openLimit]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-3">
      {addNewEmplpoyee && (<div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"></div>)}
      {
        !hasLoadedOnce && isInitialLoading ? 
        (
          <HeaderSkeleton />
        ) 
        : 
        (
          user?.currentUser?.role?.permissions?.includes("Read") && (
            <div className="flex flex-col md:gap-0 gap-3 w-full bg-white dark:bg-[#0b1739] border dark:border-gray-600 border-gray-300 rounded-md px-2 md:px-6 py-3">
              <div className="flex justify-between w-full items-center">
                <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">{pageName} List ({employees?.pagination?.totalCount ?? 0})</p>
                {
                  user?.currentUser?.role?.permissions?.includes("Create") && (
                    <button type="button" disabled={user?.loading} onClick={() => setAddNewEmployee(true)} className="border cursor-pointer font-normal dark:border-gray-600 border-gray-300 rounded-md text-black hover:text-white dark:text-white text-[14px] leading-6 px-5 py-0.5 transition-all hover:bg-[#7b57e0] dark:hover:bg-sky-500">Add New Employee</button>
                  )
                }
              </div>
              <div className="w-full flex-wrap whitespace-nowrap flex justify-start md:gap-0 gap-5 md:justify-between">
                <div className="flex gap-10 items-center">
                  <DropDown items={itemsLimit} selectedItem={limit} buttonLabel="Items Per Page" disabled={user?.loading} isOpen={openLimit} setIsOpen={setOpenLimit} onSelect={selectLimit} dropdownRef={limitRef} fieldKey="limit" />
                  <DropDown items={roles} selectedItem={selectedRoleName} buttonLabel={getFieldLabel("role") || "Role"} disabled={user?.loading} isOpen={openRoles} setIsOpen={setOpenRoles} onSelect={selectRole} dropdownRef={rolesRef} fieldKey="roleType"  />
                  {
                    user?.currentUser?.role?.permissions?.includes("Create") && (
                      <div className="flex flex-col">
                        <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">{getFieldLabel("deleted")}</p>
                        <div className="flex gap-3 items-center">
                          <div className="flex gap-1 items-center">
                            <input type="radio" name="active" className="cursor-pointer"  value="true" checked={activeFilter === "true"} onChange={() => { setActiveFilter("true"); setDeleted(true); setPage(1); setIsInitialLoading(true); }} />
                            <p className="text-[12px] leading-5.5 text-black font-normal dark:text-white">True</p>
                          </div>
                          <div className="flex gap-1 items-center">
                            <input type="radio" name="active" className="cursor-pointer" value="false" checked={activeFilter === "false"} onChange={() => { setActiveFilter("false"); setDeleted(false); setPage(1); setIsInitialLoading(true); }}/>
                            <p className="text-[12px] leading-5.5 text-black font-normal dark:text-white">False</p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div>
                <form onSubmit={searchSubmitForm} className="flex flex-col">
                  <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">Search</p>
                  <div className="flex gap-2 items-center bg-white px-3 py-1.5 dark:bg-[#081028] border border-gray-300 dark:border-gray-600 rounded-md shadow transition-all duration-300 ease-in-out focus-within:border-[#7b57e0] focus-within:shadow-[0_0_8px_0_rgba(0,132,165,0.3)]">
                    <input type="text" name="search" className="w-full md:w-60 outline-none text-[14px] text-[#334155] dark:text-white font-normal" placeholder="Search... (min. 4 characters)" value={searchInput} onChange={handleSearchInputChange} />
                    <button type="submit" disabled={user?.loading} className="w-5 h-5 flex items-center justify-center">
                      <Search className="w-full h-full text-[#334155] dark:text-white" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        )
      }
      <div id="scrollableDiv" className="w-full h-full overflow-x-auto custom-scrollbar border dark:border-gray-600 border-gray-300 rounded-md">
        {
          (loading || isSearching) ?
          (
            <TableSkeleton showHeader={true} />
          )
          :
          (
            <InfiniteScroll 
              dataLength={employees?.data?.length ?? 0} 
              next={fetchNextData} 
              hasMore={hasMore} 
              loader={<TableSkeleton showHeader={false} />} 
              scrollableTarget="scrollableDiv" 
              endMessage={
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No more employees to load</p>
              }
            >
              <table className="w-full whitespace-nowrap">
                <thead className="border-b-2 border-gray-300 dark:border-gray-600 w-full sticky top-0 bg-white dark:bg-[#0b1739] z-10">
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
                    employees?.data && employees?.data?.length > 0 && employees?.data?.map?.((employee: any, index: number) => (
                      <tr key={employee?._id} className={`transition-all duration-300 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black cursor-pointer hover:-translate-y-px ${index % 2 === 0 ? "bg-gray-100 dark:bg-[#081028]" : "bg-white dark:bg-[#0b1739]"}`}>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.employeeID}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.firstName}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.lastName}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.email}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.gender}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.role?.roleType}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.createdBy?.firstName} {employee?.createdBy?.lastName}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.modifiedBy?.firstName} {employee?.modifiedBy?.lastName}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{employee?.deleted ? "In Active" : "Active"}</td>
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
            </InfiniteScroll>
          )
        }
      </div>

      {addNewEmplpoyee && <AddEmployee closeModal={() => setAddNewEmployee(false)} addNewEmplpoyee={addNewEmplpoyee} />}
    </div>
  );
};

export default Employees;