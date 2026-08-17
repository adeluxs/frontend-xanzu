import { PointIcon } from "@/icons";
import SafeImage from "@/components/common/SafeImage";
import { landingImageFallback } from "@/utils/landingFallbacks";
import { backgroundImageStyle, normalizeMediaSource } from "@/utils/media";

const AboutUs = ({ data, contents = [] }) => {
  const title = data?.title;
  const description = data?.description;
  const backgroundFallback = landingImageFallback(
    "about-us",
    "background_image",
  );
  const backgroundImage = normalizeMediaSource(
    data?.background_image,
    backgroundFallback,
  );
  const leftFallback = landingImageFallback("about-us", "left_image");
  const leftImage = normalizeMediaSource(data?.left_image, leftFallback);
  const items = contents.length > 0 ? contents : [];

  return (
    <section
      className="section_space-py bg-cover bg-no-repeat bg-center w-full h-full"
      style={backgroundImageStyle(backgroundImage, backgroundFallback)}
      id="about"
    >
      <div className="custom-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7.5 items-center">
          {leftImage && (
            <div className="ltr:pl-0 ltr:pr-0 rtl:pl-0 rtl:pr-0 2xl:ltr:pr-[112px] 2xl:ltr:pl-0 2xl:rtl:pl-[112px] 2xl:rtl:pr-0">
              <div className="w-full h-full lg:h-[500px] 3xl:h-[620px] rounded-3xl md:rounded-[30px] overflow-hidden">
                <SafeImage
                  src={leftImage}
                  fallbackSrc={leftFallback}
                  alt="about us"
                  width={950}
                  height={950}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[52px] leading-[36px] md:leading-[46px] lg:leading-[62px] font-bold text-white w-full 2xl:w-[70%] mb-3 sm:mb-5 lg:mb-7.5">
              {title}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl font-normal text-white/60">
              {description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-7.5 mt-5 lg:mt-10">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-5">
                  <div>
                    <PointIcon className="w-7.5 h-7.5 text-white/60" />
                  </div>
                  <div>
                    <h5 className="text-base sm:text-lg font-bold text-white mb-1">
                      {item?.title}
                    </h5>
                    <p className="text-sm sm:text-base font-normal text-white/60">
                      {item?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
