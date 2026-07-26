"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const layout = ({ children }) => {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  // Hide navigation for these routes
  const hideNavigation =
    pathname.includes("/withdraw-account/add-withdraw-account") ||
    (pathname.includes("/withdraw-account/") &&
      pathname.includes("/edit-withdraw-account"));

  return (
    <div className="dashboard-top-gap">
      {!hideNavigation && (
        <div className="inline-flex mb-[30px]">
          <Link
            href="/dashboard/withdraw"
            className={`px-3 py-[10px] border-b-2 font-semibold text-[14px] transition-colors duration-200
              ${
                isActive("/dashboard/withdraw")
                  ? "border-primary text-grayish"
                  : "text-[#8D999B] border-grayish/16"
              }`}
          >
            Withdraw
          </Link>
          <Link
            href="/dashboard/withdraw/withdraw-account"
            className={`px-3 py-[10px] border-b-2 font-semibold text-[14px] transition-colors duration-200
              ${
                isActive("/dashboard/withdraw/withdraw-account")
                  ? "border-primary text-grayish"
                  : "text-[#8D999B] border-grayish/16"
              }`}
          >
            Withdraw Account
          </Link>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default layout;
