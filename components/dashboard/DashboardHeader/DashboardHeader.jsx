"use client";
import NotificationDropdown from "@/app/(landingPage)/common/NotificationDropdown";
import UserDropdown from "@/app/(landingPage)/common/UserDropdown";
import LanguageDropdown from "@/components/ui/dropdowns/LanguageDropdown";
import { useT } from "@/context/TranslationContext";
import { usePathname } from "next/navigation";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import { getNavSections } from "../navSections";

const DashboardHeader = ({ onMenuClick }) => {
  const t = useT();
  const currentPath = usePathname();

  const sections = getNavSections(t);

  const headerRouteAliases = [
    {
      title: t("dashboard.deliveryItem"),
      hrefs: ["/dashboard/listing/delivery-item"],
    },
    {
      title: t("dashboard.settings"),
      hrefs: [
        "/dashboard/profile-settings",
        "/dashboard/password-settings",
        "/dashboard/2fa",
      ],
    },
    {
      title: t("dashboard.supportTicket"),
      hrefs: ["/dashboard/support-ticket"],
    },
  ];

  const activeHeaderTitle = (() => {
    for (const alias of headerRouteAliases) {
      for (const href of alias.hrefs) {
        if (currentPath === href || currentPath.startsWith(`${href}/`)) {
          return alias.title;
        }
      }
    }
    for (const section of sections) {
      for (const item of section.items) {
        const isActive =
          item.href === "/dashboard"
            ? currentPath === "/dashboard"
            : currentPath.startsWith(item.href);

        if (isActive) {
          return item.name;
        }
      }
    }
    return t("dashboard.dashboard");
  })();

  return (
    <header className="bg-transparent h-16 z-10">
      <div className="flex items-center justify-between h-full rtl:pr-5 ltr:pl-5 rtl:pl-7.5 ltr:pr-7.5 mt-5">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="text-gray-700 hover:text-gray-900 block lg:hidden"
            onClick={onMenuClick}
          >
            <HiOutlineBars3CenterLeft className="text-2xl" />
          </button>
          <h1 className="text-sm sm:text-[20px] font-semibold text-grayish">
            {activeHeaderTitle}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <LanguageDropdown isDashboard={true} />
          </div>
          <div className="hidden sm:block">
            <NotificationDropdown />
          </div>
          <div className="rtl:pr-4 ltr:pr-0">
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
