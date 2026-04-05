"use client";
import React from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import { getWebsite } from "@/Utils/GraphQL/Graph";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Social, GetWebsiteQueryResult } from "@/types";

const Icons: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
};

const AuthSideBar = () => {
  const { data, loading, error } = useQuery<GetWebsiteQueryResult>(getWebsite);
  const websiteData = data?.website;

  if (loading) {
    return (
      <div className="ml-40 flex flex-col gap-10 py-10 px-5 w-full h-[75%] bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)] relative items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6C97A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-40 flex flex-col gap-10 py-10 px-5 w-full h-[75%] bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)] relative items-center justify-center">
        <p className="text-red-500">Error loading website data</p>
      </div>
    );
  }

  return (
    <div className="ml-40 flex flex-col gap-10 py-10 px-5 w-full h-[75%] bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)] relative">
      <div className="w-36">
        {
          websiteData?.logo && (
            <Image src={websiteData?.logo} alt={websiteData?.title || "Website Logo"} width={500} height={500} priority className="w-full object-contain" quality={100} />
          )
        }
      </div>
      <div className="flex flex-col gap-5 justify-center items-center w-full">
        <p className="text-5xl text-white font-medium font-enriqueta">{websiteData?.title}</p>
      </div>
      <div className="flex justify-between items-center w-full absolute bottom-5">
        <p className="text-[14px] leading-6 w-full text-gray-300">{websiteData?.copyright}</p>
        <div className="flex gap-5 w-full items-center">
          {
            websiteData?.socialLinks?.map((social: Social, index: number) => {
              const IconComponent = Icons[social?.name?.toLowerCase()];
              if (!IconComponent) return null;
              return (
                <Link key={social?._id || index} href={social?.link} target="_blank" rel="noopener noreferrer" className="hover:-translate-y-1 cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-[#E6C97A] p-1 text-[#1B293F] hover:text-[#E6C97A] transition-all duration-300 hover:bg-[#111B28]">
                  <IconComponent className="w-5 h-5" />
                </Link>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default AuthSideBar;