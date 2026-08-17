import SafeImage from "@/components/common/SafeImage";
import {
  landingContentImageFallback,
  landingImageFallback,
} from "@/utils/landingFallbacks";
import { backgroundImageStyle, normalizeMediaSource } from "@/utils/media";

const HowItWorks = ({ data, contents = [] }) => {
  const title = data?.title;
  const backgroundFallback = landingImageFallback(
    "how-it-works",
    "background_image",
  );
  const backgroundImage = normalizeMediaSource(
    data?.background_image,
    backgroundFallback,
  );
  const rightFallback = landingImageFallback("how-it-works", "right_image");
  const rightImage = normalizeMediaSource(data?.right_image, rightFallback);
  const steps =
    contents?.length > 0
      ? contents?.map((step) => ({
          icon: step?.icon,
          title: step?.title,
          desc: step?.description,
        }))
      : [];

  return (
    <section
      className="section_space-py bg-cover bg-no-repeat w-full h-full"
      style={backgroundImageStyle(backgroundImage, backgroundFallback)}
    >
      <div className="custom-container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-7.5 items-center">
          <div className="col-span-2 lg:col-span-6 xl:col-span-7">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[52px] font-bold text-grayish mb-10 md:mb-15">
              {title}
            </h2>

            <div className="flex flex-col gap-3 sm:gap-0">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-5 sm:gap-6 xl:gap-10"
                >
                  <div className="flex flex-col items-start sm:items-center">
                    {normalizeMediaSource(
                      step?.icon,
                      landingContentImageFallback("how-it-works", i),
                    ) && (
                      <div className="w-8 sm:w-10 h-8 sm:h-10 flex-shrink-0">
                        <SafeImage
                          src={step?.icon}
                          fallbackSrc={landingContentImageFallback(
                            "how-it-works",
                            i,
                          )}
                          alt="step icon"
                          width={50}
                          height={50}
                          sizes="40px"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {i < steps?.length - 1 && (
                      <div className="hidden sm:block sm:flex-1 border-l-2 border-dashed border-[#596A6E] my-2 min-h-[50px] xl:min-h-[77px]" />
                    )}
                  </div>

                  <div className="-translate-y-3">
                    <h3 className="text-grayish font-bold text-lg sm:text-xl md:text-2xl mb-1">
                      {step?.title}
                    </h3>
                    <p className="text-grayish/80 text-sm md:text-base leading-relaxed">
                      {step?.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {rightImage && (
            <div className="col-span-2 lg:col-span-6 xl:col-span-5">
              <div className="w-full h-full lg:h-[500px] 3xl:h-[620px] rounded-3xl md:rounded-[30px] overflow-hidden">
                <SafeImage
                  src={rightImage}
                  fallbackSrc={rightFallback}
                  alt="how it works"
                  width={1250}
                  height={1250}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
