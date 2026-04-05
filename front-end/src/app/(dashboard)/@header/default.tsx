"use client";
import { useState } from "react";
import Header from "./Header";


export default function DashboardRedirect() {
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);

  return <Header isLeftSideBarOpen={isLeftSideBarOpen} setIsLeftSideBarOpen={setIsLeftSideBarOpen} />;
}
