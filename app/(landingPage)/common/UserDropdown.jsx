"use client";
import { useT } from "@/context/TranslationContext";
import {
  PasswordSettingsIcon,
  ProfileSettingsIcon,
  SignOutIcon,
  SupportTicketIcon,
  TwoFaIcon,
} from "@/icons";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { normalizeMediaSource } from "@/utils/media";

const UserDropdown = () => {
  const { data: user, isLoading: isUserLoading } = useGetUserQuery();
  const [logout, { isLoading: logoutLoading, isSuccess: logoutSuccess }] =
    useLogoutMutation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const t = useT();
  const avatarSource = normalizeMediaSource(
    user?.data?.avatar,
    "/assets/common/user/user.png",
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    try {
      await logout().unwrap();
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="static" ref={dropdownRef}>
      {" "}
      {/* Changed to static or relative */}
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full transition-all duration-300 flex justify-center items-center"
          onClick={() => setOpen((prev) => !prev)}
        >
          {isUserLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <Image
              src={avatarSource}
              alt="user"
              width={150}
              height={140}
              unoptimized
              className="w-full h-full object-contain rounded-full"
            />
          )}
        </button>
      </div>
      <div
        className={`
              absolute ltr:right-2 ltr:left-auto rtl:left-2 rtl:right-auto sm:ltr:right-8 sm:rtl:left-8 top-[80px] w-[280px] bg-white border border-[rgba(7,33,38,0.16)] rounded-2xl notification-shadow z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] p-2.5
              ${
                open
                  ? "opacity-100 visible scale-100 translate-y-0"
                  : "opacity-0 invisible scale-95 translate-y-2"
              }
            `}
      >
        <div className="py-3 px-2 flex gap-2.5 items-center border-b border-[#CECECE]">
          {isUserLoading ? (
            <div>
              <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full">
                <Image
                  src={avatarSource}
                  alt="user"
                  width={150}
                  height={140}
                  className="w-full h-full object-contain rounded-full"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-grayish">
                  {user?.data?.username}
                </h3>
                <p className="text-base font-medium text-grayish/60">
                  {user?.data?.email}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="max-h-[370px] overflow-y-auto pt-3">
          <ul className="space-y-1.5">
            <li>
              <Link
                href="/dashboard/settings/account-settings"
                onClick={handleClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-grayish hover:bg-grayish/5 transition-all duration-300"
              >
                <ProfileSettingsIcon className="h-4.5 w-4.5 text-grayish" />
                {t("dashboard.profileSettings")}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings/password-settings"
                onClick={handleClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-grayish hover:bg-grayish/5 transition-all duration-300"
              >
                <PasswordSettingsIcon className="h-4.5 w-4.5 text-grayish" />
                {t("dashboard.passwordSettings")}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/support-ticket"
                onClick={handleClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-grayish hover:bg-grayish/5 transition-all duration-300"
              >
                <SupportTicketIcon className="h-4.5 w-4.5 text-grayish" />
                {t("dashboard.supportTicket")}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings/two-fa-verify"
                onClick={handleClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-grayish hover:bg-grayish/5 transition-all duration-300"
              >
                <TwoFaIcon className="h-4.5 w-4.5 text-grayish" />
                {t("dashboard.twoFa")}
              </Link>
            </li>
            <li>
              <div className="h-px bg-grayish/10 my-2" />
            </li>
            <li>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-grayish transition-all duration-300 hover:bg-error hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-grayish"
                onClick={handleLogOut}
                disabled={logoutLoading}
              >
                <SignOutIcon
                  className={`h-4.5 w-4.5 ${logoutLoading ? "animate-pulse" : ""}`}
                />
                <span>
                  {logoutLoading
                    ? t("dashboard.loggingOut")
                    : t("dashboard.logout")}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
