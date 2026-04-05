"use client";
import { Dispatch, SetStateAction, RefObject } from "react";
import { ChevronDown, Star, X, Plus } from "lucide-react";

type MultiDropDownItem = {
  _id: string;
  moduleName?: string;
  [key: string]: any;
};

type MultiDropDownProps = {
  items: MultiDropDownItem[];
  selectedItems: MultiDropDownItem[];
  buttonLabel: string;
  disabled?: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (item: MultiDropDownItem) => void;
  onRemove: (item: MultiDropDownItem) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  required?: boolean;
};

const MultiDropdown = ({
  items,
  selectedItems,
  buttonLabel,
  disabled = false,
  isOpen,
  setIsOpen,
  onSelect,
  onRemove,
  dropdownRef,
  required = false,
}: MultiDropDownProps) => {
  return (
    <div className="relative h-full flex w-full flex-col gap-0.5">
      <div className="flex gap-1">
        <p className="text-[16px] leading-6.5 text-black font-normal dark:text-white">{buttonLabel}</p>
        {required && <Star className="text-red-400 mt-1 fill-current" size={11} />}
      </div>
      <button type="button" onClick={() => !disabled && setIsOpen((prev) => !prev)} disabled={disabled} className={`flex justify-between gap-3 cursor-pointer items-center w-full px-3 py-1 rounded-md border bg-white ${ disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}>
        <p className={`text-[14px] leading-6 font-normal text-gray-700`}>{buttonLabel}</p>
        <ChevronDown className={`w-3 h-3 text-gray-800 transition-transform duration-300 ${ isOpen ? "rotate-180" : "" }`}  />
      </button>
      {
        isOpen && (
          <div className="absolute w-full h-fit rounded-sm left-0 top-16 bg-white z-60 flex-col flex border overflow-y-auto shadow-lg" ref={dropdownRef}>
            {
              items?.length > 0 && (
                items?.map((item, index) => {
                  const isSelected = selectedItems?.some((selected) => selected?._id === item?._id);
                  return (
                    <button key={item?._id} disabled={disabled || isSelected} type="button" onClick={() => onSelect(item)} className={`${index === 0 ? "rounded-t-sm" : ""} ${index === items.length - 1 ? "rounded-b-sm" : ""} transition-colors duration-300 ${isSelected ? "bg-[#e0d4f5] text-gray-500 cursor-not-allowed" : "hover:text-white hover:bg-[#7b57e0] cursor-pointer"} text-[12px] px-3 py-1 leading-5.5 text-left text-black dark:text-gray-300 font-normal w-full`}>{item?.moduleName}</button>
                  );
                })
              )
            }
          </div>
        )
      }
      {
        selectedItems?.length > 0 && (
          <div className="flex flex-wrap gap-5 w-full items-center my-2">
            {
              selectedItems?.map((item) => (
                <div key={item?._id} className="flex gap-0.5 relative items-center">
                  <p className="text-[13px] leading-5.75 font-normal bg-[#7b57e0] rounded-sm px-3 py-1 text-white">{item?.moduleName}</p>
                  <button disabled={disabled} onClick={() => onRemove(item)} type="button" className="absolute -right-3 -top-2 w-6 h-6 flex items-center justify-center transition-all duration-300 hover:bg-red-500 bg-red-400 cursor-pointer rounded-full p-0.5">
                    <X className="text-white" size={15} />
                  </button>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

export default MultiDropdown;