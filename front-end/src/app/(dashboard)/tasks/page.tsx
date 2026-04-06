"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import TableSkeleton from "@/Skelton/TableSkeleton";
import HeaderSkeleton from "@/Skelton/HeaderSkeleton";
import { getModuleFields } from "@/Utils/API/module";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { deleteTaskPemrmanent, getTasks } from "@/Utils/API/task";
import { itemsLimit, statusItems } from "@/Utils/Helper";
import DropDown from "@/Components/Dropdown";
import { Column, TaskResponse } from "@/types";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Loader, Search, Trash } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import AddTask from "./(.)add/page";
import ViewTask from "./(.)view/page";
import EditTask from "./(.)edit/page";
import { deleteTaskFailure, deleteTaskStart, deleteTaskSuccess } from "@/Redux/User/UserSlice";
import toast from "react-hot-toast";

const Tasks = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: any }) => state.user);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const path = usePathname(); 
  const pageName = path.split("/")[1].charAt(0).toUpperCase() + path.split("/")[1].slice(1);

  const limitRef = useRef<HTMLDivElement | null>(null);
  const [openLimit, setOpenLimit] = useState(false);
  const [limit, setLimit] = useState("10");

  const statusRef = useRef<HTMLDivElement | null>(null);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectStatus] = useState("Pending");

  const startDateRef = useRef<HTMLDivElement | null>(null);
  const completedDateRef = useRef<HTMLDivElement | null>(null);

  const [showAddTask, setShowAddTask] = useState(false);
  const [showViewTask, setShowViewTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false)
  const [taskID, setTaskID] = useState("");
  const [deleteTask, setDeleteTask] = useState(false);

  const openViewTask = (task: any) => {
    setTaskID(task?._id);
    setShowViewTask(true);
  };

  const closeViewTask = () => {
    setTaskID("");
    setShowViewTask(false);
  };

  const openEditTask = (task: any) => {
    setTaskID(task?._id);
    setShowEditTask(true);
  };

  const closeEditTask = () => {
    setTaskID("");
    setShowEditTask(false);
  };

  const handleStartDate = (value: Date | [Date | null, Date | null] | null) => {
    if (value instanceof Date) {
      handleStartDateChange(value);
    }
  };

  const handleCompletedDate = (value: Date | [Date | null, Date | null] | null) => {
    if (value instanceof Date) {
      handleEndDateChange(value);
    }
  };

  const openDeletePopup = (task: any) => {
    setDeleteTask(true);
    setTaskID(task?._id);
  };

  const closeDeletePopup = () => {
    setDeleteTask(false);
    setTaskID("");
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(deleteTaskStart());
    const result = await deleteTaskPemrmanent(user?.accessToken, taskID);
    if (result.success) {
      dispatch(deleteTaskSuccess(result?.data));
      toast.success(result?.message);
    } else {
      dispatch(deleteTaskFailure(result?.message));
      toast.error(result?.message);
    }
    setDeleteTask(false);
  };

  const getStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  };

  const getEndDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    setShowStartCalendar(false);
    setPage(1);
  };

  const handleEndDateChange = (date: Date) => {
    setCompletedDate(date);
    setShowCompletedCalendar(false);
    setPage(1);
  };

  const [startDate, setStartDate] = useState(getStartDate());
  const [completedDate, setCompletedDate] = useState(getEndDate());
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showCompletedCalendar, setShowCompletedCalendar] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectStatus = (item: any) => {
    setSelectStatus(item?.status);
    setOpenStatus(false);
    setPage(1);
  };

  const selectLimit = (item: any) => {
    setLimit(item?.limit);
    setOpenLimit(false);
    setPage(1);
  };

  const fetchData = async () => {
    setLoading(true);
    setTasks(null);
    setPage(1);
    setHasMore(true);
    const columnsData = await getModuleFields(user?.accessToken, user?.currentModule, true);
    if (columnsData?.success) {
      setColumns(columnsData.data || []);
    }
    const tasksData = await getTasks(
      user?.accessToken,
      user?.currentUser?.role?._id,
      search,
      startDate,
      completedDate,
      selectedStatus,
      1,
      Number(limit)
    );
    if (tasksData?.success) {
      const taskResult = tasksData;
      setHasMore(taskResult?.data?.length === parseInt(limit) && taskResult?.pagination?.hasNextPage);
      setTasks(tasksData);
    } else if (tasksData?.success === false) {
      setTasks(null);
      setHasMore(false);
    }
    setLoading(false);
    setIsSearching(false);
    setIsInitialLoading(false);
  };

  const fetchNextData = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = page + 1;
      const tasksData = await getTasks(
        user?.accessToken,
        user?.currentUser?.role?._id,
        search,
        startDate,
        completedDate,
        selectedStatus,
        nextPage,
        Number(limit)
      );
      if (tasksData?.success && tasksData?.data?.length > 0) {
        const newTasks = tasksData.data;
        setTasks((prev) => {
          if (!prev) return tasksData;
          const existingIds = new Set(prev.data.map((p) => p._id));
          const uniqueNewTasks = newTasks.filter((p: any) => !existingIds.has(p._id));
          return {
            ...prev,
            data: [...prev.data, ...uniqueNewTasks],
            pagination: tasksData.pagination,
          };
        });
        setPage(nextPage);
        setHasMore(tasksData?.data?.length === Number(limit) && tasksData?.pagination?.hasNextPage);
      } else {
      setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  };
  
  const getFieldLabel = (fieldName: string) => {
    const data = columns?.find((col) => col?.fieldName === fieldName)?.fieldLabel;
    return `${data}`;
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
    }
  };

  useEffect(() => {
    if (!user?.accessToken || !user?.currentModule) return;
    fetchData();
  }, [user?.accessToken, user?.currentModule, selectedStatus, limit, search, startDate, completedDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openStatus && statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setOpenStatus(false);
      }  
      if (openLimit && limitRef.current && !limitRef.current.contains(e.target as Node)) {
        setOpenLimit(false);
      }
      if (showStartCalendar && startDateRef.current && !startDateRef.current.contains(e.target as Node)) {
        setShowStartCalendar(false);
      }
      if (showCompletedCalendar && completedDateRef.current && !completedDateRef.current.contains(e.target as Node)) {
        setShowCompletedCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openStatus, openLimit, showStartCalendar, showCompletedCalendar]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredStatusItems = statusItems?.filter(item => {
    if (item?.status === "Draft") {
      return user?.currentUser?.role?.permissions?.includes("Create");
    }
    return true; 
  });

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showAddTask) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    };
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showAddTask]);

  const showHeaderSkeleton = isInitialLoading;

  return (
    <div className="flex flex-col w-full h-full gap-3">
      {showAddTask && (<div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"></div>)}
      {showViewTask && (<div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"></div>)}
      {showEditTask && (<div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"></div>)}
      {deleteTask && (<div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"></div>)}
      {
        showHeaderSkeleton ? 
        (
          <HeaderSkeleton />
        ) 
        : 
        (
          user?.currentUser?.role?.permissions?.includes("Read") && (
            <div className="flex flex-col md:gap-0 gap-3 w-full bg-white dark:bg-[#0b1739] border dark:border-gray-600 border-gray-300 rounded-md px-2 md:px-6 py-3">
              <div className="flex justify-between w-full items-center">
                <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">{pageName} List ({(tasks?.pagination?.totalCount ?? 0) > 0 ? tasks?.pagination?.totalCount  : ""})</p>
                {
                  user?.currentUser?.role?.permissions?.includes("Create") && (
                    <button type="button" disabled={user?.loading} onClick={() => setShowAddTask(true)} className="border cursor-pointer font-normal dark:border-gray-600 border-gray-300 rounded-md text-black hover:text-white dark:text-white text-[14px] leading-6 px-5 py-0.5 transition-all hover:bg-[#7b57e0] dark:hover:bg-sky-500">Create Task</button>
                  )
                }
              </div>
              <div className="w-full flex-wrap whitespace-nowrap flex justify-start md:gap-0 gap-5 md:justify-between">
                <DropDown items={filteredStatusItems} selectedItem={selectedStatus} buttonLabel={getFieldLabel("status") || "Status"} disabled={user?.loading} isOpen={openStatus} setIsOpen={setOpenStatus} onSelect={selectStatus} dropdownRef={statusRef} fieldKey="status" />
                <DropDown items={itemsLimit} selectedItem={limit} buttonLabel="Items Per Page" disabled={user?.loading} isOpen={openLimit} setIsOpen={setOpenLimit} onSelect={selectLimit} dropdownRef={limitRef} fieldKey="limit" />
                <div ref={startDateRef} className="flex flex-col relative">
                  <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">Start Date</p>
                  <div className="bg-white px-3 py-1 rounded-md shadow border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 transition-colors dark:bg-[#081028]" onClick={() => { setShowStartCalendar(!showStartCalendar); setShowCompletedCalendar(false); }}>
                    <p className="text-[12px] leading-5.5 text-black font-normal dark:text-white">{formatDate(startDate)}</p>
                  </div>
                  {
                    showStartCalendar && (
                      <div className="absolute top-14 w-60 md:w-72 right-0 md:-left-12 z-50 bg-white rounded-lg shadow-lg">
                        <Calendar onChange={handleStartDate} value={startDate} maxDate={completedDate} className="rounded-lg" />
                      </div>
                    )
                  }
                </div>
                <div ref={completedDateRef} className="flex flex-col relative">
                  <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">Completed Date</p>
                  <div className="bg-white px-3 py-1 rounded-md shadow border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 transition-colors dark:bg-[#081028]" onClick={() => { setShowCompletedCalendar(!showCompletedCalendar); setShowStartCalendar(false); }}>
                    <p className="text-[12px] leading-5.5 text-black font-normal dark:text-white">{formatDate(completedDate)}</p>
                  </div>
                  {
                    showCompletedCalendar && (
                      <div className="absolute top-14 w-60 md:w-72  md:-left-12 z-50 bg-white rounded-lg shadow-lg">
                        <Calendar onChange={handleCompletedDate} value={completedDate} minDate={startDate} className="rounded-lg" />
                      </div>
                    )
                  }
                </div>
                <form onSubmit={searchSubmitForm} className="flex flex-col md:w-auto w-full">
                  <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">Search</p>
                  <div className="flex gap-2 items-center bg-white px-3 py-1.5 dark:bg-[#081028] border border-gray-300 dark:border-gray-600 rounded-md shadow transition-all duration-300 ease-in-out focus-within:border-[#7b57e0] focus-within:shadow-[0_0_8px_0_rgba(0,132,165,0.3)]">
                    <input type="text" name="search" className="w-60 outline-none text-[14px] text-[#334155] dark:text-white font-normal" placeholder="Search... (min. 4 characters)" value={searchInput}onChange={handleSearchInputChange}/>
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
      <div id="scrollableDiv" className="w-full h-full overflow-x-auto overflow-y-auto custom-scrollbar border dark:border-gray-600 border-gray-300 rounded-md">
        {
          (loading || isSearching) ?
          (
            <TableSkeleton showHeader={true} />
          )
          :
          (
            <InfiniteScroll 
              dataLength={tasks?.data?.length ?? 0} 
              next={fetchNextData} 
              hasMore={hasMore} 
              loader={<TableSkeleton showHeader={false} />} 
              scrollableTarget="scrollableDiv" 
              endMessage={
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No more tasks to load</p>
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
                    tasks?.data && tasks?.data?.length > 0 && tasks?.data?.map?.((task: any, index: number) => (
                      <tr key={task?._id} className={`transition-all duration-300 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black cursor-pointer hover:-translate-y-px ${index % 2 === 0 ? "bg-gray-100 dark:bg-[#081028]" : "bg-white dark:bg-[#0b1739]"}`}>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.taskID}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.taskName}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.status}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.startDate ? formatDate(new Date(task?.startDate)) : " "}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.completedDate ? formatDate(new Date(task?.completedDate)) : " "}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.assignedTo?.firstName} {task?.assignedTo?.lastName}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.createdBy?.firstName} {task?.createdBy?.lastName}</td>
                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-normal text-black dark:text-gray-300">{task?.modifiedBy?.firstName} {task?.modifiedBy?.lastName}</td>
                        <td className="py-1.5 px-4 whitespace-nowrap">
                          <div className="flex gap-2 items-center justify-center">
                            <button onClick={() => openViewTask(task)} type="button" disabled={user?.loading} className="border cursor-pointer font-medium dark:border-gray-600 border-gray-300 rounded-md text-black hover:text-white dark:text-white text-[12px] leading-5.5 px-2 py-0.5 transition-all hover:bg-[#7b57e0] dark:hover:bg-sky-500">View</button>
                            {
                              user?.currentUser?.role?.permissions?.includes("Update") && (
                                <button onClick={() => openEditTask(task)} type="button" disabled={user?.loading} className="border cursor-pointer font-medium dark:border-gray-600 border-gray-300 rounded-md text-black hover:text-white dark:text-white text-[12px] leading-5.5 px-2 py-0.5 transition-all hover:bg-[#7b57e0] dark:hover:bg-sky-500">Edit</button>
                              )
                            }
                            {
                              user?.currentUser?.role?.permissions?.includes("Delete") && (
                                <button onClick={() => openDeletePopup(task)} type="button" disabled={user?.loading} className="border cursor-pointer font-medium dark:border-gray-600 border-gray-300 rounded-md text-black hover:text-white dark:text-white text-[12px] leading-5.5 px-2 py-0.5 transition-all hover:bg-[#7b57e0] dark:hover:bg-sky-500">Delete</button>
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

      <div className={`border-t-4 border-red-400 fixed flex justify-center left-1/2 top-1/2 z-50 bg-[#F8F9FA] dark:bg-[#1F2937] rounded-t-md rounded-md -translate-x-1/2 w-full md:w-100 transition-all duration-500 ease-out ${deleteTask ? "-translate-y-1/2 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"}`}>
        <form onSubmit={submitHandler} className="flex flex-col gap-5 w-full p-3 md:p-6 items-center h-full justify-center">
          <div className="flex gap-5 w-full justify-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full p-3 bg-red-400">
              <Trash className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[#333333] dark:text-white font-semibold text-[20px] leading-7.5">Delete Task</p>
              <p className="text-[#333333] dark:text-white font-semibold text-[14px] leading-6">Are you sure you want to delete this task?</p>
            </div>
          </div>
          <div className="flex justify-between w-full items-center gap-1 md:gap-5">
            <button disabled={user?.loading} type="button" onClick={closeDeletePopup} className="px-4 md:px-2 w-fit md:w-full transition-colors duration-300 hover:bg-gray-100 cursor-pointer py-3 rounded-md text-[14px] leading-6 font-semibold border border-gray-300 text-black bg-white">Cancel</button>
            <button disabled={user?.loading} type="submit" className="px-4 md:px-2 flex items-center justify-center cursor-pointer w-fit md:w-full py-3 rounded-md text-[14px] leading-6 font-semibold bg-red-400 text-white">{user?.loading ? <Loader className="text-white h-5 w-5 animate-spin" /> : "Delete Employee"} </button>
          </div>
        </form>
      </div>

      {showAddTask && <AddTask closeModal={() => setShowAddTask(false)} showAddTask={showAddTask} />}
      {showViewTask && <ViewTask closeModal={closeViewTask} showViewTask={showViewTask} taskID={taskID} />}
      {showEditTask && <EditTask closeModal={closeEditTask} showEditTask={showEditTask} taskID={taskID} />}
    </div>
  );
};

export default Tasks;