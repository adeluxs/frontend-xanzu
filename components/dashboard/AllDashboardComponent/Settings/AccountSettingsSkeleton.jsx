const AccountSettingsSkeleton = () => {
  return (
    <div className="max-w-[796px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-12 gap-5">
        {/* Profile Photo Skeleton */}
        <div className="col-span-2 sm:col-span-12">
          <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-32 w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-200" />
        </div>

        {/* Input Field Skeletons (repeated for layout) */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="col-span-2 sm:col-span-6">
            <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
            <div className="h-11 w-full bg-gray-100 rounded-md" />
          </div>
        ))}

        {/* Button Skeleton */}
        <div className="col-span-2 sm:col-span-12">
          <div className="mt-4 h-12 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSkeleton;
