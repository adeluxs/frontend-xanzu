import Image from "next/image";
import Link from "next/link";

const AppLinkSection = ({ data }) => {
  const title = data?.title;
  const description = data?.description;
  const backgroundImage = data?.background_image;
  const rightImage = data?.right_image;
  const appStoreUrl = data?.app_store_url || "/";
  const appStoreIcon = data?.app_store_icon;
  const playStoreUrl = data?.play_store_url || "/";
  const playStoreIcon = data?.play_store_icon;

  return (
    <section
      className="section_space-py bg-cover bg-no-repeat bg-center w-full h-full"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="custom-container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-7.5 items-center">
          <div className="col-span-2 md:col-span-7">
            <div className="ltr:pl-0 ltr:pr-0 rtl:pl-0 rtl:pr-0 xl:rtl:pl-[165px] xl:rtl:pr-0 xl:ltr:pr-[165px] xl:ltr:pl-0">
              <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[52px] leading-[36px] md:leading-[46px] lg:leading-[62px] font-bold text-grayish mb-4">
                {title}
              </h4>
              <p className="text-base sm:text-lg lg:text-xl font-normal text-grayish/80">
                {description}
              </p>
              <div className="flex items-center gap-3 sm:gap-5 mt-5 sm:mt-8 md:mt-10 xl:mt-[80px]">
                <Link
                  href={appStoreUrl}
                  className="h-[40px] sm:h-[50px] xl:h-[60px] w-auto"
                >
                  <Image
                    src={appStoreIcon}
                    alt="app store"
                    width={150}
                    height={150}
                    className="w-auto h-full object-contain"
                    unoptimized={appStoreIcon.startsWith("http")}
                  />
                </Link>
                <Link
                  href={playStoreUrl}
                  className="h-[40px] sm:h-[50px] xl:h-[60px] w-auto"
                >
                  <Image
                    src={playStoreIcon}
                    alt="play store"
                    width={150}
                    height={150}
                    className="w-auto h-full object-contain"
                    unoptimized={playStoreIcon.startsWith("http")}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-5">
            <div className="rtl:pr-0 ltr:pl-0 2xl:rtl:pr-8 2xl:ltr:pl-8">
              <div className="w-full h-full xl:h-[530px] 2xl:h-[570px] 3xl:h-[590px]">
                <Image
                  src={rightImage}
                  alt="app"
                  width={950}
                  height={950}
                  className="w-full h-full object-cover"
                  unoptimized={rightImage.startsWith("http")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppLinkSection;
