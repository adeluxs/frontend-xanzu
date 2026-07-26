"use client";
import { useT } from "@/context/TranslationContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const layout = ({ children }) => {
  const pathname = usePathname();
  const siteTwoFa = useSelector(
    (state) => state.settings.settings.fa_verification,
  );
  const t = useT();

  const isActive = (path) => {
    return pathname === path;
  };

  // Hide navigation for these routes
  const hideNavigation = pathname.includes("/kyc-details");

  const isActivePath = (path) => {
    if (path === "/dashboard/settings/kyc-verify") {
      return pathname === path || pathname.startsWith(path + "/");
    }
    return pathname === path;
  };

  return (
    <div className="dashboard-top-gap">
      {!hideNavigation && (
        <div className="inline-flex mb-[30px]">
          <Link
            href="/dashboard/settings/account-settings"
            className={`px-3 py-[10px] border-b-2 font-semibold text-[14px] transition-colors duration-200
              ${
                isActive("/dashboard/settings/account-settings")
                  ? "border-primary text-grayish"
                  : "text-[#8D999B] border-grayish/16"
              }`}
          >
            {t("dashboard.accountSettings")}
          </Link>
          <Link
            href="/dashboard/settings/password-settings"
            className={`px-3 py-[10px] border-b-2 font-semibold text-[14px] transition-colors duration-200
              ${
                isActive("/dashboard/settings/password-settings")
                  ? "border-primary text-grayish"
                  : "text-[#8D999B] border-grayish/16"
              }`}
          >
            {t("dashboard.passwordSettings")}
          </Link>
          {String(siteTwoFa) === "1" && (
            <Link
              href="/dashboard/settings/two-fa-verify"
              className={`px-3 py-[10px] border-b-2 font-semibold text-[14px] transition-colors duration-200
              ${
                isActive("/dashboard/settings/two-fa-verify")
                  ? "border-primary text-grayish"
                  : "text-[#8D999B] border-grayish/16"
              }`}
            >
              {t("dashboard.twoFa")}
            </Link>
          )}

          <Link
            href="/dashboard/settings/kyc-verify"
            className={`px-3 py-[10px] border-b-2 font-semibold text-[14px] transition-colors duration-200
              ${
                isActive("/dashboard/settings/kyc-verify")
                  ? "border-primary text-grayish"
                  : "text-[#8D999B] border-grayish/16"
              }`}
          >
            {t("dashboard.kyc")}
          </Link>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default layout;
