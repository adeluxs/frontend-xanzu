const NotificationSkeleton = () => {
  return (
    <div className="dashboard-top-gap">
      <div className="border border-[#E4E8EE] rounded-[16px] overflow-hidden">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex sm:flex-row flex-col gap-4 items-start p-4 border-b border-[#E4E8EE] last:border-b-0 animate-pulse"
          >
            {/* Icon Skeleton */}
            <div className="flex shrink-0 items-center justify-center h-[32px] w-[32px] rounded-full bg-gray-200" />

            {/* Text Skeleton */}
            <div className="w-full">
              <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSkeleton;
