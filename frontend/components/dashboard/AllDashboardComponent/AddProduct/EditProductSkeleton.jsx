const EditProductSkeleton = () => {
  const FieldSkeleton = ({ className = "" }) => (
    <div className={className}>
      <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200" />
      <div className="h-[52px] w-full animate-pulse rounded-[14px] bg-gray-100" />
    </div>
  );

  return (
    <div className="dashboard-top-gap">
      <div className="rounded-[12px] border border-[rgba(31,42,55,0.15)] bg-white p-4 sm:p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-20 animate-pulse rounded-[10px] bg-gray-200" />
          <div className="h-10 w-28 animate-pulse rounded-[10px] bg-gray-100" />
          <div className="h-10 w-24 animate-pulse rounded-[10px] bg-gray-100" />
          <div className="h-10 w-24 animate-pulse rounded-[10px] bg-gray-100" />
        </div>

        <div className="my-5 h-px w-full bg-gray-200" />

        {/* Form Card */}
        <div className="rounded-[12px] border border-[rgba(31,42,55,0.10)] bg-white p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />

            <div className="hidden lg:block" />

            {/* Product Type */}
            <div>
              <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-5">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>

            <div className="hidden lg:block" />

            <FieldSkeleton />
            <FieldSkeleton />

            {/* Base Price */}
            <div>
              <div className="mb-3 h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="flex h-[52px] w-full items-center overflow-hidden rounded-[14px] bg-gray-100">
                <div className="h-full flex-1 animate-pulse bg-gray-100" />
                <div className="mr-3 h-9 w-9 animate-pulse rounded-[10px] bg-gray-200" />
              </div>
            </div>

            {/* Discount */}
            <div>
              <div className="mb-3 h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-3">
                <div className="h-[52px] flex-1 animate-pulse rounded-[14px] bg-gray-100" />
                <div className="h-[52px] w-24 animate-pulse rounded-[14px] bg-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-7 flex justify-end">
          <div className="h-10 w-20 animate-pulse rounded-[10px] bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default EditProductSkeleton;
