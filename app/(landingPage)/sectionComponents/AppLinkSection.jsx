import {
  backgroundImageStyle,
  isRemoteMediaSource,
  normalizeLinkHref,
  normalizeMediaSource,
} from "@/utils/media";
import Image from "next/image";
import Link from "next/link";

const AppLinkSection = ({ data }) => {
  const title = data?.title;
  const description = data?.description;
  const backgroundImage = normalizeMediaSource(data?.background_image);
  const rightImage = normalizeMediaSource(data?.right_image);
  const appStoreUrl = normalizeLinkHref(data?.app_store_url, "/");
  const appStoreIcon = normalizeMediaSource(data?.app_store_icon);
  const playStoreUrl = normalizeLinkHref(data?.play_store_url, "/");
  const playStoreIcon = normalizeMediaSource(data?.play_store_icon);

  return (
    <section
      className="section_space-py bg-cover bg-no-repeat bg-center w-full h-full"
      style={backgroundImageStyle(backgroundImage)}
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
                {appStoreIcon && (
                  <Link
                    href={appStoreUrl}
                    className="h-[40px] sm:h-[50px] xl:h-[60px] w-auto"
                  >
                    <Image
                      src={appStoreIcon}
                      alt="app store"
                      width={180}
                      height={60}
                      sizes="180px"
                      className="w-auto h-full object-contain"
                      unoptimized={isRemoteMediaSource(appStoreIcon)}
                    />
                  </Link>
                )}
                {playStoreIcon && (
                  <Link
                    href={playStoreUrl}
                    className="h-[40px] sm:h-[50px] xl:h-[60px] w-auto"
                  >
                    <Image
                      src={playStoreIcon}
                      alt="play store"
                      width={180}
                      height={60}
                      sizes="180px"
                      className="w-auto h-full object-contain"
                      unoptimized={isRemoteMediaSource(playStoreIcon)}
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
          {rightImage && (
            <div className="col-span-2 md:col-span-5">
              <div className="rtl:pr-0 ltr:pl-0 2xl:rtl:pr-8 2xl:ltr:pl-8">
                <div className="w-full h-full xl:h-[530px] 2xl:h-[570px] 3xl:h-[590px]">
                  <Image
                    src={rightImage}
                    alt="app"
                    width={950}
                    height={950}
                    sizes="(max-width: 768px) 100vw, 42vw"
                    className="w-full h-full object-cover"
                    unoptimized={isRemoteMediaSource(rightImage)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppLinkSection;
