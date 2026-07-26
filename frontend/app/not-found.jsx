"use client";

import Button from "@/components/ui/button/Button";
import Image from "next/image";

const NotFound = () => {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/error/error-page-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-6">
        <div className="relative w-full flex justify-center items-center">
          <div className="w-[280px] sm:w-[500px] md:w-[660px] h-[450px]">
            <Image
              src="/assets/error/page-not-found-img.png"
              alt="404 illustration"
              width={660}
              height={450}
              className="w-full h-full object-contain"
              priority
              draggable={false}
            />
          </div>
          <div className="absolute flex flex-col items-center justify-center gap-1 top-1/2 left-1/2 -translate-1/2">
            <div className="mt-[-70px] sm:mt-[-100px] md:mt-[-150px] rtl:ml-4 ltr:mr-4 sm:rtl:ml-18 sm:ltr:mr-18 md:rtl:ml-16 md:ltr:mr-16">
              <h1 className="font-bold text-2xl sm:text-[40px] leading-none tracking-tight text-grayish sm:mb-1 mb-0 text-center">
                404
              </h1>
              <p className="text-grayish/60 text-base font-medium text-center">
                Page Not Found
              </p>
              <div className="mt-2 sm:mt-7.5">
                <Button
                  type="submit"
                  variant="primary-filled"
                  size="compact"
                  className="h-[28px] sm:h-[36px]"
                  rounded="md"
                  onClick={() => window.history.back()}
                >
                  Go to back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
