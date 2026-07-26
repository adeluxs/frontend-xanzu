"use client";

import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import { ArrowTopRightIcon } from "@/icons";
import { useGetAllNotificationsQuery } from "@/lib/features/notification/notificationApi";
import { useState } from "react";
import NotificationSkeleton from "./NotificationSkeleton";
import { useT } from "@/context/TranslationContext";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const {
    data: allNotifications,
    currentData,
    isLoading,
    isFetching,
  } = useGetAllNotificationsQuery({
    page,
  });

  const resolvedCurrentPage =
    currentData?.meta?.current_page ||
    allNotifications?.meta?.current_page ||
    1;
  const showNotificationsLoading =
    isLoading || (isFetching && resolvedCurrentPage !== page);
  const notificationData = currentData ?? allNotifications;
  const notifications = notificationData?.data || [];
  const meta = notificationData?.meta;
  const t = useT();

  const handlePageClick = (selectedItem) => {
    const selectedPage = selectedItem.selected + 1;
    setPage(selectedPage);
  };

  return (
    <div className="dashboard-top-gap">
      {showNotificationsLoading ? (
        <NotificationSkeleton />
      ) : (
        <div className="border border-[#E4E8EE] rounded-[16px] overflow-hidden">
          {notifications.length === 0 && (
            <div className="py-10">
              <NoDataFound message={t("dashboard.noNotificationFound")} />
            </div>
          )}

          {notifications.map((item, index) => (
            <div
              key={item.id}
              className={`flex sm:flex-row flex-col gap-4 items-start p-4 cursor-pointer border-b border-[#E4E8EE] last:border-b-0 ${
                !item.is_read ? "bg-primary/10" : ""
              }`}
            >
              <div className="flex shrink-0 items-center justify-center h-[32px] w-[32px] rounded-full bg-[#88E788]">
                <ArrowTopRightIcon className="h-4.5 w-4.5 text-grayish" />
              </div>

              <div>
                <p className="text-sm font-medium text-grayish mb-2 sm:mb-2">
                  {item.message}
                </p>
                <p className="text-sm font-normal text-grayish/60">
                  {item.created_at}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5">
        <Pagination
          lastPage={meta?.last_page || allNotifications?.meta?.last_page || 0}
          currentPage={page}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
};

export default Notifications;
