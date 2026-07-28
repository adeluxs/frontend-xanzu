"use client";
import { useT } from "@/context/TranslationContext";
import { useOrderCounterQuery } from "@/lib/features/orderCounter/orderCounterApi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DashboardLogo from "./DashboardLogo";
import { getNavSections } from "../navSections";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const t = useT();
  const currentPath = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);
  const { data: orderCount, isLoading: isOrderCountLoading } =
    useOrderCounterQuery();

  const totalPendingOrders = orderCount?.data?.count;

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const sections = getNavSections(t, totalPendingOrders);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`
          fixed inset-y-0 rtl:right-0 ltr:left-0 z-50 w-[min(17.375rem,calc(100vw-1rem))] sm:w-69.5 transform
          transition-transform duration-300 ease-in-out bg-white lg:bg-transparent
          ${isOpen ? "visible translate-x-0" : "invisible rtl:translate-x-full ltr:-translate-x-full"}
          lg:visible lg:fixed lg:rtl:-translate-x-0 lg:ltr:translate-x-0 lg:flex lg:flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 lg:h-16 px-6 mt-0 sm:mt-5">
          <Link href="/" className="h-[20px] sm:h-[22px] w-auto">
            <DashboardLogo />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-0 sm:mt-6 px-4 h-full overflow-y-auto no-scrollbar-show">
          <div className="space-y-3 lg:space-y-6">
            {sections.map((section) => (
              <div key={section.title || "top"}>
                {section.title && (
                  <p className="px-4 text-[15px] font-normal tracking-wide text-grayish/60 mb-2">
                    {section.title}
                  </p>
                )}
                <ul className="space-y-0.5 lg:space-y-1.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/dashboard"
                        ? currentPath === "/dashboard"
                        : currentPath === item.href ||
                          currentPath.startsWith(`${item.href}/`);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`group flex items-center px-4 py-2.5 text-[15px] font-medium rounded-[12px] transition-colors duration-200 ${
                            isActive
                              ? "bg-[rgba(68,241,166,0.20)] text-grayish"
                              : "text-grayish/80 hover:bg-[rgba(68,241,166,0.20)] hover:text-grayish"
                          }`}
                        >
                          <Icon
                            className={`rtl:ml-4 ltr:mr-4 h-5 w-5 shrink-0 ${
                              isActive
                                ? "text-grayish"
                                : "text-grayish/80 group-hover:text-grayish"
                            }`}
                          />

                          <span className="min-w-0 flex-1 truncate">
                            {item.name}
                          </span>

                          {Number(item?.badge) > 0 && (
                            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-[11px] font-semibold leading-none text-white">
                              {Number(item?.badge) > 99 ? "99+" : item?.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;
