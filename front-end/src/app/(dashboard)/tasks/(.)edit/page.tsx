"use client";
import { Column } from "@/types";
import { getModuleFields } from "@/Utils/API/module";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTaskByID, updateTask } from "@/Utils/API/task";
import { Loader, Star, X } from "lucide-react";
import JoditEditor from "jodit-react";
import TaskDropdown from "@/Components/TaskDropdown";
import { formatDateWithTimezone, statusItems } from "@/Utils/Helper";
import Calendar from "react-calendar";
import EmployeeDropdown from "@/Components/EmployeeDropdown";
import FormSkeleton from "@/Skelton/FormSkelton";
import { updateTaskFailure, updateTaskStart, updateTaskSuccess } from "@/Redux/User/UserSlice";
import toast from "react-hot-toast";

type ShowContentProps = {
  label: string;
  value: string;
};

const ShowContent = ({label, value}: ShowContentProps) => {

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <p className="text-[16px] leading-7 text-black font-normal">{label}</p>
      <p className="bg-[#F9FAFB] font-normal text-black outline-none text-[14px] leading-6 py-1 px-3 rounded-md border transition-all duration-300 ease-in-out w-full">{value}</p>
    </div>
  );
};

type EditTaskProps = {
  closeModal: () => void;
  showEditTask: boolean;
  taskID: string;
};

const EditTask: React.FC<EditTaskProps> = ({
  closeModal,
  showEditTask,
  taskID,
}) => {
  const user = useSelector((state: { user: any }) => state.user);
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [field, setFields] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState({
    taskName: "",
    description: "",
    status: "",
    startDate: new Date(),
    completedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignedTo: "",
  });

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: taskData?.description,
      height: 300,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      disablePlugins: ["paste"],
      uploader: { insertImageAsBase64URI: true },
      toolbarAdaptive: false,
      toolbarSticky: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      defaultActionOnPaste: "insert_as_html" as any,
      beautifyHTML: false,
    }),
    [taskData?.description],
  );

  const statusRef = useRef<HTMLDivElement | null>(null);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectStatus] = useState("");

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showCompletedCalendar, setShowCompletedCalendar] = useState(false);
  const startDateRef = useRef<HTMLDivElement | null>(null);
  const completedDateRef = useRef<HTMLDivElement | null>(null);

  const [assignedEmployee, setAssignedEmployee] = useState("");

  const startDateChange = (value: Date | [Date | null, Date | null] | null) => {
    if (value instanceof Date) {
      handleStartDate(value);
    };
  };

  const handleStartDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date >= today) {
      setTaskData(prev => ({
        ...prev,
        startDate: date
      }));
      const minCompletedDate = new Date(date);
      minCompletedDate.setHours(minCompletedDate.getHours() + 24);

      if (taskData.completedDate < minCompletedDate) {
        setTaskData(prev => ({
          ...prev,
          completedDate: minCompletedDate
        }));
      }
    }
    setShowStartCalendar(false);
  };

  const completedDateChange = (value: Date | [Date | null, Date | null] | null) => {
    if (value instanceof Date) {
      handleCompletedDate(value);
    };
  };

  const handleCompletedDate = (date: Date) => {
    const minDate = new Date(taskData.startDate);
    minDate.setHours(minDate.getHours() + 24);
    if (date >= minDate) {
      setTaskData(prev => ({
        ...prev,
        completedDate: date
      }));
    }
    setShowCompletedCalendar(false);
  };

  const selectStatus = (item: any) => {
    setSelectStatus(item?.status);
    setTaskData(prev => ({
      ...prev,
      status: item?.status
    }));
    setOpenStatus(false);
  };

  const filteredStatusItems = statusItems?.filter(item => {
    if (item?.status === "Draft") {
      return user?.currentUser?.role?.permissions?.includes("Create");
    }
    return true;
  });

  const inputChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTaskData(prev => ({
      ...prev,
      taskName: value
    }));
  };

  const handleChange = (newContent: string) => {
    setTaskData(prev => ({
      ...prev,
      description: newContent
    }));
  };

  const resetTask = () => {
    setTaskData({
      taskName: "",
      description: "",
      status: "",
      startDate: new Date(),
      completedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedTo: "",
    });
    setSelectStatus("");
    setAssignedEmployee("");
  };

  const getData = async () => {
    setLoading(true);
    const result = await getModuleFields(
      user?.accessToken,
      user?.currentModule,
      undefined,
    );
    const task = await getTaskByID(user?.accessToken, taskID);
    if (task?.success && task?.data) {
      const taskDataObj = task?.data;
      setTaskData({
        taskName: taskDataObj?.taskName || "",
        description: taskDataObj?.description || "",
        status: taskDataObj?.status || "",
        startDate: taskDataObj?.startDate ? new Date(taskDataObj?.startDate) : new Date(),
        completedDate: taskDataObj?.completedDate ? new Date(taskDataObj?.completedDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedTo: taskDataObj?.assignedTo?._id || "",
      });
      setSelectStatus(taskDataObj?.status || "");
      setAssignedEmployee(taskDataObj?.assignedTo ? `${taskDataObj?.assignedTo?.firstName} ${taskDataObj?.assignedTo?.lastName}` : "");
    } else {
      resetTask();
    }
    if (result?.success) {
      setFields(result?.data);
    } else {
      setFields([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showEditTask && taskID) {
      getData();
    }
  }, [showEditTask, taskID]);

  const getFieldLabel = (fieldName: string) => {
    const data = field?.find((col) => col?.fieldName === fieldName)?.fieldLabel;
    return `${data}`;
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = useCallback(() => {
    resetTask();
    setIsAnimating(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  }, [closeModal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openStatus && statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setOpenStatus(false);
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
  }, [openStatus, showStartCalendar, showCompletedCalendar]);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateTaskStart());
    const payload = {
      ...taskData,
      startDate: formatDateWithTimezone(taskData.startDate),
      completedDate: formatDateWithTimezone(taskData.completedDate),
    };

    const result = await updateTask(user?.accessToken, taskID, payload);
    if (result?.success) {
      toast.success(result?.message);
      dispatch(updateTaskSuccess());
      handleClose();
    } else {
      dispatch(updateTaskFailure());
      toast.error(result?.message);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isFormValid = useMemo(() => {
    return (
      taskData?.taskName?.trim() !== "" &&
      selectedStatus?.trim() !== "" &&
      taskData?.startDate instanceof Date &&
      taskData?.completedDate instanceof Date &&
      assignedEmployee?.trim() !== "" &&
      taskData?.description?.trim() !== ""
    );
  }, [taskData, selectedStatus, assignedEmployee]);

   const hasAllPermissions = user?.currentUser?.role?.permissions?.includes("Read") && user?.currentUser?.role?.permissions?.includes("Create") && user?.currentUser?.role?.permissions?.includes("Delete") && user?.currentUser?.role?.permissions?.includes("Update");

  return (
    <div className="fixed inset-0 z-50 w-full md:w-6xl m-auto h-140">
      <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? "opacity-100" : "opacity-0"}`} />
      <div className={`absolute bottom-0 w-full h-full flex justify-center items-end transform transition-transform duration-700 ease-out origin-bottom ${isAnimating ? "scale-y-100" : "scale-y-0"}`} style={{ perspective: "1500px", transformStyle: "preserve-3d" }}>
        <div className="relative w-full h-full bg-linear-to-b rounded-l-xl from-[#f5e6d3] to-[#d4b595] shadow-2xl overflow-hidden" style={{ transform: isAnimating ? "rotateX(0deg) translateY(0)" : "rotateX(90deg) translateY(100%)", transformOrigin: "bottom", transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <div className="absolute left-0 top-0 bottom-0 w-2 md:w-8 bg-linear-to-r from-[#E8DFC7] to-[#9b7a5a] shadow-2xl z-10" />
          <div className="absolute left-8 right-0 top-0 bottom-0 bg-linear-to-br from-[#FAF3E1] to-[#d4b595] shadow-inner">
            <div className="flex flex-col w-full h-full">
              <div className="flex justify-between w-full items-center px-5 pt-3 pb-1">
                <p className="text-[18px] leading-7 text-black font-normal">Edit Task</p>
                <p className="text-[18px] leading-7 text-[#562F00] font-medium">{user?.currentPage}</p>
                <button onClick={handleClose} type="button" disabled={user?.loading} className="w-6 h-6 flex items-center cursor-pointer justify-center">
                  <X className="w-full h-full text-black transition-all duration-300 hover:rotate-180 hover:scale-125" />
                </button>
              </div>
              <hr />
              {
                loading ?
                (
                  <FormSkeleton />
                )
                :
                (
                  <form onSubmit={submitForm} className="w-full flex flex-col custom-scrollbar gap-2 px-4 py-5 h-full overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-x-8 gap-y-2">
                      {
                        hasAllPermissions ? 
                        (
                          <div className="flex flex-col gap-0.5 w-full">
                            <div className="flex gap-1">
                              <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("taskName")}</p>
                              <Star className="text-red-400 mt-1 fill-current" size={11} />
                            </div>
                            <input value={taskData?.taskName} onChange={inputChangeHanlder} disabled={user?.loading} required autoComplete="off" type="text" name={taskData?.taskName} placeholder={getFieldLabel("taskName")} className={`bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-1 px-3 rounded-md border transition-all duration-300 ease-in-out w-full`} />
                          </div>
                        )
                        :
                        (
                          <ShowContent label={getFieldLabel("taskName")} value={taskData?.taskName} />
                        )
                      }
                      <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex gap-1">
                          <TaskDropdown required={false} items={filteredStatusItems} selectedItem={selectedStatus} buttonLabel={getFieldLabel("status") || "Status"} disabled={user?.loading} isOpen={openStatus} setIsOpen={setOpenStatus} onSelect={selectStatus} dropdownRef={statusRef} fieldKey="status" />
                        </div>
                      </div>
                      {
                        hasAllPermissions ?
                        (
                          <div className="flex flex-col gap-0.5 w-full">
                            <div className="flex gap-1">
                              <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("startDate")}</p>
                              <Star className="text-red-400 mt-1 fill-current" size={11} />
                            </div>
                            <div ref={startDateRef} className="flex flex-col relative">
                              <div className="bg-white px-3 py-1 rounded-md shadow border cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { setShowStartCalendar(!showStartCalendar); setShowCompletedCalendar(false); }}>
                                <p className="text-[14px] leading-6 text-black font-normal">{formatDate(taskData?.startDate)}</p>
                              </div>
                              {
                                showStartCalendar && (
                                  <div className="absolute top-8 w-72 left-0 z-10 bg-white rounded-lg shadow-lg">
                                    <Calendar
                                      onChange={startDateChange}
                                      value={taskData?.startDate}
                                      minDate={new Date()}
                                      className="rounded-lg"
                                    />
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        )
                        :
                        (
                          <ShowContent label={getFieldLabel("startDate")} value={formatDate(taskData?.startDate)}  />
                        )
                      }
                      {
                        hasAllPermissions ?
                        (
                          <div className="flex flex-col gap-0.5 w-full">
                            <div className="flex gap-1">
                              <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("completedDate")}</p>
                              <Star className="text-red-400 mt-1 fill-current" size={11} />
                            </div>
                            <div ref={completedDateRef} className="flex flex-col relative">
                              <div className="bg-white px-3 py-1 rounded-md shadow border cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { setShowCompletedCalendar(!showCompletedCalendar); setShowStartCalendar(false); }}>
                                <p className="text-[14px] leading-6 text-black font-normal">{formatDate(taskData?.completedDate)}</p>
                              </div>
                              {
                                showCompletedCalendar && (
                                  <div className="absolute top-8 w-72 left-0 z-10 bg-white rounded-lg shadow-lg">
                                    <Calendar
                                      onChange={completedDateChange}
                                      value={taskData?.completedDate}
                                      minDate={new Date(taskData.startDate.getTime() + 24 * 60 * 60 * 1000)}
                                      className="rounded-lg"
                                    />
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        )
                        :
                        (
                          <ShowContent label={getFieldLabel("completedDate")} value={formatDate(taskData?.completedDate)}  />
                        )
                      }
                      {
                        hasAllPermissions ?
                        (
                          <EmployeeDropdown setTaskData={setTaskData} label={getFieldLabel("assignedTo")} assignedEmployee={assignedEmployee} setAssignedEmployee={setAssignedEmployee} />
                        )
                        :
                        (
                          <ShowContent label={getFieldLabel("assignedTo")} value={assignedEmployee} />
                        )
                      }
                    </div>
                    {
                      hasAllPermissions ?
                      (
                        <div className="flex flex-col gap-0.5 w-full">
                          <div className="flex gap-1">
                            <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("description")}</p>
                            <Star className="text-red-400 mt-1 fill-current" size={11} />
                          </div>
                          <div className="w-full border">
                            <JoditEditor ref={editor} value={taskData?.description} config={config} onBlur={handleChange} className="w-full rounded-xl" />
                          </div>
                        </div>
                      )
                      :
                      (
                        <div className="flex flex-col gap-0.5 w-full">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("description")}</p>
                          <div className="w-full border">
                            <div dangerouslySetInnerHTML={{ __html: taskData?.description || "" }} className="border-gray-200 shadow border bg-white custom-scrollbar rounded-sm px-3 py-0.5 h-48 overflow-y-auto" />
                          </div>
                        </div>
                      )
                    }
                    <div className="flex gap-5 w-full mt-3 items-center">
                      <button type="button" disabled={user?.loading} onClick={handleClose} className="text-[14px] w-32 flex items-center justify-center h-10 leading-6 border border-[#6848C1] font-medium duration-300 transition-all cursor-pointer rounded-sm text-black bg-white">Cancel</button>
                      <button type="submit" disabled={user?.loading || !isFormValid} className={`text-[14px] w-32 flex items-center justify-center h-10 leading-6 font-medium hover:bg-[#6848C1] duration-300 transition-all cursor-pointer rounded-sm bg-[#7b57e0] text-white ${!isFormValid ? "opacity-80 cursor-not-allowed" : ""}`}>{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Update"}</button>
                    </div>
                  </form>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;