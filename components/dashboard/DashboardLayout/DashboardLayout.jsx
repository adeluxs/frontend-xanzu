"use client";
import { useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import DashboardSidebar from "../DashboardSidebar/DashboardSidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F9F9F9]">
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col rtl:mr-0 rtl:ml-0 ltr:mr-0 ltr:ml-0 lg:rtl:mr-69.5 lg:rtl:ml-0 lg:ltr:ml-69.5 lg:ltr:mr-0 min-h-screen">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-3 sm:p-5 bg-white dashboard-shadow rounded-[16px] border border-[rgba(7,33,38,0.08)] -translate-y-[55px] -mb-[45px] rtl:ml-[10px] ltr:mr-[10px] rtl:mr-2.5 ltr:ml-2.5 lg:rtl:mr-0 lg:ltr:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
