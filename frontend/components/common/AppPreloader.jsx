"use client";

const AppPreloader = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <div className="h-12 w-12 rounded-full border-[4px] border-primary/20 border-t-primary animate-spin" />
        </div>
        <p className="mt-5 text-base font-medium text-grayish/60">Loading...</p>
      </div>
    </div>
  );
};

export default AppPreloader;
