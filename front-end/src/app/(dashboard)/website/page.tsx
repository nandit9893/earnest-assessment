"use client";
import { getWebsiteData } from "@/Utils/API/website";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type WebsiteType = {
  title?: string;
  copyright?: string;
  websiteUrl?: string;
  supportNumber?: string;
  supportEmail?: string;
  otpTimer?: number;
  logo?: string;
};

const Website = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: any }) => state.user);
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState<WebsiteType>({});

  const getWebsite = async () => {
    setLoading(true);
    const result = await getWebsiteData(user?.accessToken);
    if (result?.success) {
      setWebsite(result?.data);console.log(result)
    } else {
      setWebsite({});
    }
    setLoading(false);
  };

  useEffect(() => {
    if(user?.accessToken) {
        getWebsite();
    }
  }, [user?.accessToken]);

  return (
    <div className="flex flex-col w-full h-full gap-3 bg-white dark:bg-[#0b1739] p-10">
      <div className="flex gap-5 w-full">
        <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">Website Title:</p>
        <p className="bg-[#F9FAFB] font-normal text-black border-gray-200 dark:border-gray-600 shadow outline-none text-[14px] leading-6 py-0.5 px-3 rounded-md border dark:bg-[#081028] dark:text-white">{website?.title}</p>
      </div>
      <div className="flex gap-5 w-full">
        <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">Copyright Title:</p>
        <p className="bg-[#F9FAFB] font-normal text-black border-gray-200 dark:border-gray-600 shadow outline-none text-[14px] leading-6 py-0.5 px-3 rounded-md border dark:bg-[#081028] dark:text-white">{website?.copyright}</p>
      </div>
      {
        website?.websiteUrl && (
          <div className="flex gap-5 w-full">
            <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">Webapp:</p>
            <Link href={website?.websiteUrl} target="_blank" rel="noopener noreferrer" className="bg-[#F9FAFB] cursor-pointer font-normal text-black border-gray-200 dark:border-gray-600 shadow outline-none text-[14px] leading-6 py-0.5 px-3 rounded-md border dark:bg-[#081028] dark:text-white">{website?.websiteUrl}</Link>
          </div>
        )
      }
      <div className="flex gap-5 w-full">
        <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">Support Contact:</p>
        <p className="bg-[#F9FAFB] font-normal text-black border-gray-200 dark:border-gray-600 shadow outline-none text-[14px] leading-6 py-0.5 px-3 rounded-md border dark:bg-[#081028] dark:text-white">+91 {website?.supportNumber}</p>
      </div>
      <div className="flex gap-5 w-full">
        <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">Support Email:</p>
        <p className="bg-[#F9FAFB] font-normal text-black border-gray-200 dark:border-gray-600 shadow outline-none text-[14px] leading-6 py-0.5 px-3 rounded-md border dark:bg-[#081028] dark:text-white">{website?.supportEmail}</p>
      </div>
      <div className="flex gap-5 w-full">
        <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">OTP Timer:</p>
        <p className="bg-[#F9FAFB] font-normal text-black border-gray-200 dark:border-gray-600 shadow outline-none text-[14px] leading-6 py-0.5 px-3 rounded-md border dark:bg-[#081028] dark:text-white">{website?.otpTimer} minutes</p>
      </div>
      <div className="flex gap-5 w-full">
        <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">Social Links:</p>
        <p className="bg-[#F9FAFB] font-normal text-black border-gray-200 dark:border-gray-600 shadow outline-none text-[14px] leading-6 py-0.5 px-3 rounded-md border dark:bg-[#081028] dark:text-white">{website?.otpTimer} minutes</p>
      </div>
      <div className="flex gap-5 w-full">
        <p className="text-black dark:text-white text-[16px] leading-6.5 font-normal">Logo:</p>
        <div className="w-36">
          {
            website?.logo && (
              <Image src={website?.logo} alt={website?.title || "Website Logo"} width={500} height={500} priority className="w-full object-contain" quality={100} />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Website;