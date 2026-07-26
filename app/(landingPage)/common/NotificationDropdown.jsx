"use client";

import NoDataFound from "@/components/common/NoDataFound";
import { useT } from "@/context/TranslationContext";
import { ArrowTopRightIcon, NotificationIcon } from "@/icons";
import {
  useGetAllNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@/lib/features/notification/notificationApi";
import { useEffect, useRef, useState } from "react";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: allNotifications, isLoading } = useGetAllNotificationsQuery();
  const [markAllAsRead, { isLoading: isMarking }] = useMarkAllAsReadMutation();
  const notifications = allNotifications?.data || [];
  const t = useT();

  // Check unread notifications
  const hasUnread = notifications.some((n) => !n.is_read);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      const requestBody = {
        notification_id: null,
      };
      await markAllAsRead(requestBody).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="static" ref={dropdownRef}>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full bg-[rgba(68,241,166,0.20)] text-grayish transition-all duration-300 flex justify-center items-center"
          onClick={() => setOpen((prev) => !prev)}
        >
          <NotificationIcon className="h-5.5 w-5.5" />
        </button>

        {hasUnread && (
          <div className="absolute right-2.5 top-2.5 w-[9px] h-[9px] bg-error border border-white rounded-full"></div>
        )}
      </div>

      <div
        className={`
          absolute ltr:right-2 ltr:left-auto rtl:left-2 rtl:right-auto sm:ltr:right-8 sm:rtl:left-8 top-[80px] w-[300px] sm:w-[440px] bg-white border border-grayish/16 rounded-2xl notification-shadow z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            open
              ? "opacity-100 visible scale-100 translate-y-0"
              : "opacity-0 invisible scale-95 translate-y-2"
          }
        `}
      >
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#E4E8EE]">
          <h5 className="text-xl font-semibold text-grayish">
            {t("dashboard.notifications")}
          </h5>

          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              disabled={isMarking}
              className="text-sm font-semibold text-grayish/60 !underline hover:text-grayish disabled:opacity-50 disabled:!cursor-not-allowed"
            >
              {isMarking
                ? t("dashboard.marking")
                : t("dashboard.markAllAsRead")}
            </button>
          )}
        </div>

        <div className="max-h-[370px] overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-grayish/60 text-center">
              {t("dashboard.loading")}
            </p>
          ) : notifications.length === 0 ? (
            <div className="py-5">
              <NoDataFound message={t("dashboard.noNotificationFound")} />
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 items-start p-4 cursor-pointer border-b border-[#E4E8EE] last:border-b-0 ${
                  !item.is_read ? "bg-primary/10" : ""
                }`}
              >
                <div className="flex shrink-0 items-center justify-center h-[32px] w-[32px] rounded-full bg-[#88E788]">
                  <ArrowTopRightIcon className="h-4.5 w-4.5 text-grayish" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-grayish mb-2">
                    {item.message}
                  </p>
                  <p className="text-sm font-normal text-grayish/60">
                    {item.created_at}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
