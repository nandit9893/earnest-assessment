"use client";
import { useState } from "react";
import SideBar from "./SideBar";

export default function DashboardRedirect() {
    const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);
  
  return <SideBar isLeftSideBarOpen={isLeftSideBarOpen} setIsLeftSideBarOpen={setIsLeftSideBarOpen}  />;
}