"use client";
import { Dispatch, SetStateAction, RefObject } from "react";
import { ChevronDown } from "lucide-react";

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
};

const DropDown = ({
  items,
  selectedItem,
  buttonLabel,
  disabled = false,
  isOpen,
  setIsOpen,
  onSelect,
  dropdownRef,
  fieldKey
}: DropDownProps) => {
  return (
    <div className="relative flex w-fit flex-col">
      <div className="flex gap-1">
        <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">{buttonLabel}</p>
      </div>
      <button disabled={disabled} type="button" onClick={() => setIsOpen((prev) => !prev)} className="flex justify-between gap-3 cursor-pointer items-center w-full px-2 py-0.5 rounded-md border dark:bg-[#081028] dark:border-gray-600 border-gray-200 shadow dark:shadow-none focus:border-[#7b57e0] focus:shadow-[0_0_8px_0_rgba(0,132,165,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">
        <p className={`text-[12px] leading-5.5 font-normal ${selectedItem ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>{selectedItem || buttonLabel}</p>
        <ChevronDown className={`w-3 h-3 text-gray-800 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${selectedItem ? "text-black dark:text-white" : "text-gray-700 dark:text-gray-300"}`} />
      </button>
      {
        isOpen && (
          <div className="absolute w-full h-36 rounded-sm left-0 top-14 bg-white dark:bg-[#081028] z-60 flex-col flex border dark:border-gray-600 border-gray-300 overflow-y-auto" ref={dropdownRef}>
            {
              items?.map((item, index) => (
                  <button key={item?._id} disabled={disabled} type="button" onClick={() => onSelect(item)} className={`${index === 0 ? "rounded-t-sm" : index === items.length - 1 ? "rounded-b-sm" : ""} transition-colors cursor-pointer duration-300 hover:text-white hover:bg-[#7b57e0]  text-[12px] px-2 py-0.5 leading-5.5 text-left text-black dark:text-gray-300 font-normal`}>{item[fieldKey]}</button>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

export default DropDown;