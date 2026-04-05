"use client";
import FormSkeleton from "@/Skelton/FormSkelton";
import { Column, TaskData } from "@/types";
import { getModuleFields } from "@/Utils/API/module";
import { getTaskByID } from "@/Utils/API/task";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

type ViewTaskProps = {
  closeModal: () => void;
  showViewTask: boolean;
  taskID: string,
};

const ViewTask: React.FC<ViewTaskProps> = ({ closeModal, showViewTask, taskID }) => {
  const user = useSelector((state: { user: any }) => state.user);
  const [isAnimating, setIsAnimating] = useState(false);
  const [field, setFields] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<TaskData | null>(null);

  const getData = async () => {
    setLoading(true);
    const result = await getModuleFields(
      user?.accessToken,
      user?.currentModule,
      undefined,
    );
    const task = await getTaskByID(user?.accessToken, taskID);
    if (task?.success) {
      setTaskData(task?.data);
    } else {
      setTaskData(null);
    }
    if (result?.success) {
      setFields(result?.data);
    } else {
      setFields([]);
    }
    setLoading(false);
  };

  
  const getFieldLabel = (fieldName: string) => {
    const data = field?.find((col) => col?.fieldName === fieldName)?.fieldLabel;
    return `${data}`;
  };

  useEffect(() => {
    if (showViewTask && taskID) {
      getData();
    }
  }, [showViewTask, taskID]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timeout);
  }, []);
  
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  }, [closeModal]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 w-full md:w-3xl m-auto h-140">
      <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? "opacity-100" : "opacity-0"}`}/>
      <div className={`absolute bottom-0 w-full h-full flex justify-center items-end transform transition-transform duration-700 ease-out origin-bottom ${isAnimating ? "scale-y-100" : "scale-y-0"}`}style={{ perspective: "1500px", transformStyle: "preserve-3d" }}>
        <div className="relative w-full h-full bg-linear-to-b rounded-l-xl from-[#f5e6d3] to-[#d4b595] dark:from-[#2f2419] dark:to-[#1b140d] shadow-2xl overflow-hidden" style={{transform: isAnimating ? "rotateX(0deg) translateY(0)" : "rotateX(90deg) translateY(100%)", transformOrigin: "bottom", transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)", }}>
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-[#E8DFC7] to-[#9b7a5a] dark:from-[#f0dfcf] dark:to-[#9b7a5a] shadow-2xl z-10" />
            <div className="absolute left-8 right-0 top-0 bottom-0 bg-linear-to-br from-[#FAF3E1] to-[#d4b595] shadow-inner">
              <div className="flex flex-col w-full h-full">
                <div className="flex justify-between w-full items-center px-5 pt-3 pb-1">
                  <p className="text-[18px] leading-7 text-black font-normal">Task</p>
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
                    <div className="w-full flex flex-col custom-scrollbar gap-2 px-4 py-5 h-full overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-x-8 gap-y-2">
                        <div className="flex flex-col gap-0.5 w-full">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("taskName")}</p>
                          <p className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black border-gray-200 shadow outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-0.5 px-3 rounded-md border">{taskData?.taskName}</p>
                        </div>
                        <div className="flex flex-col gap-0.5 w-full">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("status")}</p>
                          <p className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black border-gray-200 shadow outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-0.5 px-3 rounded-md border">{taskData?.status}</p>
                        </div>
                        <div className="flex flex-col gap-0.5 w-full">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("startDate")}</p>
                          <p className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black border-gray-200 shadow outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-0.5 px-3 rounded-md border">{taskData?.startDate ? formatDate(new Date(taskData?.startDate)) : " "}</p>
                        </div>
                        <div className="flex flex-col gap-0.5 w-full">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("completedDate")}</p>
                          <p className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black border-gray-200 shadow outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-0.5 px-3 rounded-md border">{taskData?.completedDate ? formatDate(new Date(taskData?.completedDate)) : " "}</p>
                        </div>
                        <div className="flex flex-col gap-0.5 w-full">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("assignedTo")}</p>
                          <p className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black border-gray-200 shadow outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-0.5 px-3 rounded-md border">{taskData?.assignedTo?.firstName} {taskData?.assignedTo?.lastName}</p>
                        </div>
                        <div className="flex flex-col gap-0.5 w-full">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("createdBy")}</p>
                          <p className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black border-gray-200 shadow outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-0.5 px-3 rounded-md border">{taskData?.createdBy?.firstName} {taskData?.assignedTo?.lastName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("description")}</p>
                        <div dangerouslySetInnerHTML={{ __html: taskData?.description || "" }} className="border-gray-200 shadow border bg-white custom-scrollbar rounded-sm px-3 py-0.5 h-48 overflow-y-auto" />
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;
