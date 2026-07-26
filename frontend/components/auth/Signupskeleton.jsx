const SkeletonBox = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-[rgba(7,33,38,0.06)] rounded-[14px] ${className}`}
  />
);

const SkeletonField = ({ fullWidth = false }) => (
  <div
    className={
      fullWidth ? "col-span-2 2xl:col-span-12" : "col-span-2 2xl:col-span-6"
    }
  >
    {/* Label */}
    <SkeletonBox className="h-4 w-24 mb-2 rounded-md" />
    {/* Input */}
    <SkeletonBox className="h-[52px] w-full" />
  </div>
);

const SignUpSkeleton = () => {
  return (
    <div className="min-w-full sm:min-w-[480px] 2xl:min-w-[645px] bg-white p-5 sm:p-7.5 rounded-[14px]">
      {/* Title */}
      <SkeletonBox className="h-8 w-48 mb-5 md:mb-7.5 rounded-lg" />

      <div className="grid grid-cols-2 2xl:grid-cols-12 gap-4 sm:gap-5">
        {/* First Name */}
        <SkeletonField />
        {/* Last Name */}
        <SkeletonField />
        {/* Email */}
        <SkeletonField />
        {/* Country */}
        <SkeletonField />
        {/* Phone */}
        <SkeletonField />
        {/* Gender */}
        <SkeletonField />
        {/* Password */}
        <SkeletonField />
        {/* Confirm Password */}
        <SkeletonField />

        {/* Terms checkbox */}
        <div className="col-span-2 2xl:col-span-12 flex items-center gap-3">
          <SkeletonBox className="h-5 w-5 rounded-md flex-shrink-0" />
          <SkeletonBox className="h-4 w-52 rounded-md" />
        </div>

        {/* Submit button */}
        <div className="col-span-2 2xl:col-span-12">
          <SkeletonBox className="h-[52px] w-full rounded-[14px]" />
        </div>
      </div>

      {/* Sign in link */}
      <div className="mt-6 sm:mt-10 flex justify-center">
        <SkeletonBox className="h-4 w-48 rounded-md" />
      </div>
    </div>
  );
};

export default SignUpSkeleton;
