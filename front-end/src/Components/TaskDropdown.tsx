"use client";
import { Dispatch, SetStateAction, RefObject } from "react";
import { ChevronDown, Star } from "lucide-react";

type DropDownItem = {
  _id: string;
  [key: string]: any;
};

type DropDownProps = {
  items: DropDownItem[];
  selectedItem?: string;
  buttonLabel: string;
  disabled?: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (item: DropDownItem) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;  
  fieldKey: string;
  required?: boolean,
};

const TaskDropdown = ({
  items,
  selectedItem,
  buttonLabel,
  disabled = false,
  isOpen,
  setIsOpen,
  onSelect,
  dropdownRef,
  fieldKey,
  required
}: DropDownProps) => {
  return (
    <div className="relative h-full flex w-full flex-col gap-0.5">
      <div className="flex gap-1">
        <p className="text-[16px] leading-6.5 text-black font-normal">{buttonLabel}</p>
        { required && <Star className="text-red-400 mt-1 fill-current" size={11} />}
      </div>
      <button disabled={disabled} type="button" onClick={() => setIsOpen((prev) => !prev)} className="flex justify-between gap-3 cursor-pointer items-center w-full px-3 py-1 rounded-md border bg-white disabled:opacity-60 disabled:cursor-not-allowed">
        <p className={`text-[14px] leading-6 font-normal ${selectedItem ? "text-black" : "text-gray-700"}`}>{selectedItem || buttonLabel}</p>
        <ChevronDown className={`w-3 h-3 text-gray-800 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${selectedItem ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"}`} />
      </button>
      {
        isOpen && (
          <div className="absolute w-full h-fit rounded-sm left-0 top-16 bg-white z-60 flex-col flex border overflow-y-auto" ref={dropdownRef}>
            {
              items?.map((item, index) => (
                  <button key={item?._id} disabled={disabled} type="button" onClick={() => onSelect(item)} className={`${index === 0 ? "rounded-t-sm" : index === items.length - 1 ? "rounded-b-sm" : ""} transition-colors cursor-pointer duration-300 hover:text-white hover:bg-[#7b57e0]  text-[12px] px-3 py-0.5 leading-5.5 text-left text-black font-normal`}>{item[fieldKey]}</button>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

export default TaskDropdown;