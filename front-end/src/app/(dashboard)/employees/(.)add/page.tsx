"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TaskDropdown from "@/Components/TaskDropdown";
import FormSkeleton from "@/Skelton/FormSkelton";
import { Column, EmployeeData } from "@/types";
import { getModuleFields, sideBarModules } from "@/Utils/API/module";
import { getRoles } from "@/Utils/API/role";
import { Eye, EyeOff, Loader, Star, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerEmployeeFailure, registerEmployeeStart, registerEmployeeSuccess } from "@/Redux/User/UserSlice";
import toast from "react-hot-toast";
import { registerEmployee } from "@/Utils/API/employee";
import MultiDropdown from "@/Components/MultiDropdown";

type AddEmployeeProps = {
  closeModal: () => void;
  addNewEmplpoyee: boolean;
};

const AddEmployee: React.FC<AddEmployeeProps> = ({
  closeModal,
  addNewEmplpoyee,
}) => {
  const user = useSelector((state: { user: any }) => state.user);
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [field, setFields] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  const [emplopyeeData, setEmployeeData] = useState<EmployeeData>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    gender: "",
    role: "",
    modules: []
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const rolesRef = useRef<HTMLDivElement | null>(null);
  const [openRoles, setOpenRoles] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [roles, setRoles] = useState([]);

  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [openModule, setOpenModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any[]>([]);
  const [modules, setModules] = useState([]);

  const selectRole = (item: any) => {
    setSelectedRoleName(item?.roleType);
    setEmployeeData((prev) => ({
      ...prev,
      role: item?._id,
    }));
    setOpenRoles(false);
  };

  const removeModule = (moduleItem: any) => {
    setSelectedModule((prev) => prev?.filter((m) => m?._id !== moduleItem?._id));
    setEmployeeData((prev) => ({
      ...prev,
      modules: prev?.modules?.filter((m: any) => m?._id !== moduleItem?._id),
    }));
  };

  const selectModule = (moduleItem: any) => {
    setSelectedModule((prev: any[]) => {
      if (!prev?.find((m) => m?._id === moduleItem?._id)) {
        return [...prev, moduleItem];
      }
      return prev?.filter((m) => m?._id !== moduleItem?._id);
    });
    setEmployeeData((prev) => {
      const exists = prev?.modules.find((m: any) => m === moduleItem?._id);
      let updatedModules;
      if (exists) {
        updatedModules = prev?.modules?.filter((m: any) => m !== moduleItem?._id); 
      } else {
        updatedModules = [...prev?.modules, moduleItem?._id];
      }
      return { ...prev, modules: updatedModules };
    });
    setOpenModule(false);
  };

  const inputChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFieldLabel = (fieldName: string) => {
    const data = field?.find((col) => col?.fieldName === fieldName)?.fieldLabel;
    return `${data}`;
  };

  const getData = async () =>{
    setLoading(true);
    const result = await getModuleFields(user?.accessToken, user?.currentModule, undefined);
    const rolesData = await getRoles(user?.accessToken);
    const moduelData = await sideBarModules(user?.accessToken);
    if (rolesData?.success && result?.success && moduelData?.success) {
      setRoles(rolesData?.data);
      setFields(result?.data);
      setModules(moduelData?.data);
    } else {
      setRoles([]);
      setFields([]);
      setModules([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(addNewEmplpoyee) {
      getData();
    }
  }, [addNewEmplpoyee]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  }, [closeModal]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(registerEmployeeStart());        
    const result = await registerEmployee(user?.accessToken, emplopyeeData);
    if(result?.success) {
      toast.success(result?.message);
      dispatch(registerEmployeeSuccess());
      handleClose();
    } else {
      dispatch(registerEmployeeFailure());
      toast.error(result?.message);
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeData((prev) => ({
      ...prev,
      gender: e.target.value === "true" ? "Male" : "Female",
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openRoles && rolesRef.current && !rolesRef.current.contains(e.target as Node)) {
        setOpenRoles(false);
      }
      if (openModule && moduleRef.current && !moduleRef.current.contains(e.target as Node)) {
        setOpenModule(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openRoles, openModule]);

  const isFormValid = useMemo(() => {
    return (
      emplopyeeData.firstName.trim() !== "" &&
      emplopyeeData.lastName.trim() !== "" &&
      emplopyeeData.password.trim() !== "" &&
      emplopyeeData.email.trim() !== "" &&
      emplopyeeData.gender !== "" &&
      emplopyeeData.role !== ""
    );
  }, [emplopyeeData]);

  return (
    <div className="fixed inset-0 z-50 w-full md:w-3xl m-auto h-140">
      <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? "opacity-100" : "opacity-0"}`}/>
      <div className={`absolute bottom-0 w-full h-full flex justify-center items-end transform transition-transform duration-700 ease-out origin-bottom ${isAnimating ? "scale-y-100" : "scale-y-0"}`}style={{ perspective: "1500px", transformStyle: "preserve-3d" }}>
        <div className="relative w-full h-full bg-linear-to-b rounded-l-xl from-[#f5e6d3] to-[#d4b595] shadow-2xl overflow-hidden" style={{transform: isAnimating ? "rotateX(0deg) translateY(0)" : "rotateX(90deg) translateY(100%)", transformOrigin: "bottom", transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)", }}>
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-[#E8DFC7] to-[#9b7a5a] shadow-2xl z-10" />
          <div className="absolute left-8 right-0 top-0 bottom-0 bg-linear-to-br from-[#FAF3E1] to-[#d4b595] shadow-inner">
            <div className="flex flex-col w-full h-full">
              <div className="flex justify-between w-full items-center px-5 pt-3 pb-1">
                <p className="text-[18px] leading-7 text-black font-normal">New Employee</p>
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
                      <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex gap-1">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("firstName")}</p>
                          <Star className="text-red-400 mt-1 fill-current" size={11} />
                        </div>
                        <input value={emplopyeeData?.firstName} onChange={inputChangeHanlder} disabled={user?.loading} required autoComplete="off" type="text" name="firstName" placeholder={getFieldLabel("firstName")} className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-1 px-3 rounded-md border transition-all duration-300 ease-in-out w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex gap-1">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("lastName")}</p>
                          <Star className="text-red-400 mt-1 fill-current" size={11} />
                        </div>
                        <input value={emplopyeeData?.lastName} onChange={inputChangeHanlder} disabled={user?.loading} required autoComplete="off" type="text" name="lastName" placeholder={getFieldLabel("lastName")} className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-1 px-3 rounded-md border transition-all duration-300 ease-in-out w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex gap-1">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("password")}</p>
                          <Star className="text-red-400 mt-1 fill-current" size={11} />
                        </div>
                        <div className="flex gap-3 bg-[#F9FAFB] outline-none py-1 px-3 rounded-md border transition-all duration-300 ease-in-out w-full">
                          <input value={emplopyeeData?.password} onChange={inputChangeHanlder} disabled={user?.loading} required autoComplete="off" type={isPasswordVisible ? "text" : "password"} name="password" placeholder={getFieldLabel("password")} className="placeholder:text-gray-400 font-normal outline-none text-black text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 transition-all duration-300 ease-in-out w-full" />
                          {
                            isPasswordVisible ? 
                            (
                              <button onClick={() => setIsPasswordVisible(false)} type="button" disabled={user?.loading} className="cursor-pointer">
                                <Eye className="text-black w-4 h-4" />
                              </button>
                            ) 
                            : 
                            (
                              <button onClick={() => setIsPasswordVisible(true)} type="button" disabled={user?.loading} className="cursor-pointer">
                                <EyeOff className="text-black w-4 h-4" />
                              </button>
                            )
                          }
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex gap-1">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("email")}</p>
                          <Star className="text-red-400 mt-1 fill-current" size={11} />
                        </div>
                        <input value={emplopyeeData?.email} onChange={inputChangeHanlder} disabled={user?.loading} required autoComplete="off" type="email" name="email" placeholder={getFieldLabel("email")} className="bg-[#F9FAFB] placeholder:text-gray-400 font-normal text-black outline-none text-[14px] leading-6 placeholder:text-[12px] placeholder:leading-5.5 py-1 px-3 rounded-md border transition-all duration-300 ease-in-out w-full" />
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex gap-1">
                          <p className="text-[16px] leading-7 text-black font-normal">{getFieldLabel("gender")}</p>
                          <Star className="text-red-400 mt-1 fill-current" size={11} />
                        </div>
                        <div className="flex gap-3 items-center">
                          <div className="flex gap-1 items-center bg-white shadow border rounded-md w-full px-3 py-1">
                            <input type="radio" name="gender" className="cursor-pointer" value="true" onChange={handleGenderChange} checked={emplopyeeData.gender === "Male"} />
                            <p className="text-[14px] leading-6 text-black font-normal">Male</p>
                          </div>
                          <div className="flex gap-1 items-center bg-white shadow border rounded-md w-full px-3 py-1">
                            <input type="radio" name="gender" className="cursor-pointer" value="false" onChange={handleGenderChange} checked={emplopyeeData.gender === "Female"} />
                            <p className="text-[14px] leading-6 text-black font-normal">Female</p>
                          </div>
                        </div>
                      </div>
                      <TaskDropdown required={true} items={roles} selectedItem={selectedRoleName} buttonLabel={getFieldLabel("role") || "Role"} disabled={user?.loading} isOpen={openRoles} setIsOpen={setOpenRoles} onSelect={selectRole} dropdownRef={rolesRef} fieldKey="roleType"  />
                    </div>
                    <MultiDropdown required={true} items={modules} selectedItems={selectedModule} buttonLabel={getFieldLabel("modules") || "Modules"} disabled={user?.loading} isOpen={openModule} setIsOpen={setOpenModule} onSelect={selectModule} onRemove={(item) => removeModule(item)} dropdownRef={moduleRef} />
                    <div className="flex gap-5 w-full mt-3 items-center">
                      <button type="button" disabled={user?.loading} onClick={closeModal} className="text-[14px] w-32 flex items-center justify-center h-10 leading-6 border border-[#6848C1] font-medium duration-300 transition-all cursor-pointer rounded-sm text-black bg-white">Cancel</button>
                      <button type="submit" disabled={user?.loading || !isFormValid} className={`text-[14px] w-32 flex items-center justify-center h-10 leading-6 font-medium hover:bg-[#6848C1] duration-300 transition-all rounded-sm bg-[#7b57e0] text-white ${!isFormValid || user?.loading ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}>{user?.loading ? <Loader className="w-6 h-6 text-white animate-spin" /> : "Submit"}</button>
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

export default AddEmployee;