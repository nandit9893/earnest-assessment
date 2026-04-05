"use client";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { getEmployees } from "@/Utils/API/employee";

const EmployeeDropdown = ({
  label,
  assignedEmployee,
  setAssignedEmployee,
  setTaskData,
}: {
  label: string;
  assignedEmployee: string;
  setAssignedEmployee: (value: string) => void;
  setTaskData: (value: any) => void;
}) => {
  const user = useSelector((state: { user: any }) => state.user);
  const employeeRef = useRef<HTMLDivElement | null>(null);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const filterEmployeesByPermissions = useCallback((employeeList: any[]) => {
    return employeeList?.filter(emp => {
      const permissions = emp?.role?.permissions || [];
      return permissions?.includes("Read") && permissions?.includes("Update");
    });
  }, []);


  const filterOutLoggedInEmployee = useCallback((employeeList: any[]) => {
    const loggedInUserId = user?.currentUser?._id;
    if (!loggedInUserId) return employeeList;
    return employeeList?.filter(emp => emp?._id !== loggedInUserId);
  }, [user?.currentUser?._id]);

  const filterEmployees = useCallback((employeeList: any[]) => {
    let filtered = filterEmployeesByPermissions(employeeList);
    filtered = filterOutLoggedInEmployee(filtered);
    return filtered;
  }, [filterEmployeesByPermissions, filterOutLoggedInEmployee]);

  useEffect(() => {
    if (openEmployee && employeeRef.current) {
      const rect = employeeRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 20;
      if (spaceBelow < dropdownHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [openEmployee]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const selectEmployee = (employee: any) => {
    setAssignedEmployee(`${employee?.firstName} ${employee?.lastName}`);
    setTaskData((prev: any) => ({
      ...prev,
      assignedTo: employee?._id,
    }));
    setOpenEmployee(false);
    setSearchTerm("");
  };

  const fetchData = useCallback(async (searchValue = "", pageValue = 1, append = false) => {
    if (!user?.accessToken) return;
    setLoading(true);
    try {
      const result = await getEmployees( user?.accessToken, searchValue, "", "false", pageValue, 50);
      if (result?.success) {
        const filteredEmployees = filterEmployees(result?.data || []);
        setEmployees(prev => 
          append ? [...prev, ...filteredEmployees] : filteredEmployees
        );
        let adjustedTotalCount = result?.pagination?.totalCount || 0;
        if (user?.currentUser?._id) {
          adjustedTotalCount = Math.max(0, adjustedTotalCount - 1);
        }
        setPagination({
          currentPage: result?.pagination?.currentPage || pageValue,
          totalPages: Math.ceil(adjustedTotalCount / 50),
          totalItems: adjustedTotalCount,
          hasMore: result?.pagination?.hasNextPage || false,
        });
      } else {
        setEmployees([]);
        setPagination(prev => ({ ...prev, hasMore: false }));
      }
    } catch (error) {
      setEmployees([]);
      setPagination(prev => ({ ...prev, hasMore: false }));
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken, user?.currentUser?._id, filterEmployees]);
  
  const loadMoreItems = () => {
    if (!loading && pagination.hasMore) {
      fetchData(debouncedSearchTerm, pagination.currentPage + 1, true);
    }
  };

  useEffect(() => {
    if (openEmployee) {
      fetchData(debouncedSearchTerm, 1, false);
    }
  }, [debouncedSearchTerm, openEmployee, fetchData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (employeeRef.current && !employeeRef.current.contains(e.target as Node)) {
        setOpenEmployee(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex w-full flex-col gap-0.5">
      <div className="flex gap-1">
        <p className="text-[16px] leading-6.5 text-black font-normal">{label}</p>
      </div>
      <button disabled={user?.disabled} type="button" onClick={() => setOpenEmployee((prev) => !prev)} className="flex justify-between gap-3 items-center w-full px-3 py-1.5 rounded-md border bg-[#F9FAFB] cursor-pointer transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed">
        <p className={`font-normal truncate text-[14px] leading-6 ${assignedEmployee ? "text-black" : "text-gray-400"}`}>{assignedEmployee ? assignedEmployee : `Select ${label}`}</p>
        <ChevronDown className={`w-4 h-4 text-gray-800 transition-transform duration-300 ${openEmployee ? "rotate-180" : ""}`} />
      </button>
      {
        openEmployee && (
          <div ref={employeeRef} className={`absolute rounded-sm ${ openUpward ? "bottom-24" : "top-16" } bg-white z-60 border w-full max-h-60`}>
            <div className="w-full py-1 px-2 rounded-tl-sm rounded-tr-sm sticky top-0 z-10">
              <input type="text" name="searchTerm" placeholder="Search by name, email or employee ID..." className="bg-[#F9FAFB] shadow placeholder:text-gray-400 font-normal text-black dark:text-white dark:placeholder:text-gray-400 outline-none text-[12px] leading-5.5 placeholder:text-[12px] py-1 px-3 rounded-md border transition-all duration-300 ease-in-out w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div id="employeeScrollableDiv" className="w-full h-full overflow-x-auto custom-scrollbar">
              {
                loading && employees.length === 0 ? 
                (
                  <div className="text-center py-4 text-sm text-gray-500">Loading employees...</div>
                ) 
                : 
                (
                  <InfiniteScroll dataLength={employees.length} next={loadMoreItems} hasMore={pagination.hasMore} loader={<div className="text-center py-2 text-sm text-gray-500">Loading more...</div>} scrollableTarget="employeeScrollableDiv">
                  {
                    employees?.map((item, index) => (
                      <button type="button" disabled={user?.loading} onClick={() => selectEmployee(item)} key={item?._id} className={`text-left text-[12px] w-full px-3 leading-5.5 cursor-pointer font-normal text-black transition-colors duration-300 hover:bg-[#7b57e0] ${index === employees?.length - 1 ? "rounded-b-sm" : ""}`}>
                        <p className="text-[12px] leading-5.5 transition-colors duration-300 hover:text-white text-black font-normal">{item?.firstName} {item?.lastName}</p>
                      </button>
                    ))
                  }
                  {
                    employees?.length === 0 && !loading && (
                      <p className="text-center py-4 text-sm text-gray-500">No employees found</p>
                    )
                  }
                </InfiniteScroll>
              )
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default EmployeeDropdown;