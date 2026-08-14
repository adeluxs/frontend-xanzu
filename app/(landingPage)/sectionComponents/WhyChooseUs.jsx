import { isRemoteMediaSource, normalizeMediaSource } from "@/utils/media";
import Image from "next/image";

const WhyChooseUs = ({ data, contents = [] }) => {
  const title = data?.title;
  const whyChooseLists =
    contents?.length > 0
      ? contents?.map((item, index) => ({
          icon: item?.icon,
          title: item?.title,
          des: item?.description,
        }))
      : [];

  return (
    <section className="section_space-py">
      <div className="custom-container mx-auto">
        <div className="max-w-2xl mx-auto title_mb">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[52px] font-bold text-grayish text-center">
            {title}
          </h2>
        </div>
        <div className="border border-grayish/10 rounded-3xl md:rounded-[30px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-3">
            {whyChooseLists?.map((whyChooseList, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 xl:p-7.5 flex flex-col items-center"
              >
                {normalizeMediaSource(whyChooseList?.icon) && (
                  <div className="w-8 sm:w-12.5 h-8 sm:h-12.5 flex-shrink-0 mb-3 sm:mb-5 xl:mb-10">
                    <Image
                      src={normalizeMediaSource(whyChooseList.icon)}
                      alt="why choose us icon"
                      width={50}
                      height={50}
                      sizes="50px"
                      className="w-full h-full object-cover"
                      unoptimized={isRemoteMediaSource(whyChooseList.icon)}
                    />
                  </div>
                )}
                <div>
                  <h5 className="text-base sm:text-xl lg:text-2xl font-bold text-grayish text-center mb-1.5 sm:mb-2.5">
                    {whyChooseList?.title}
                  </h5>
                  <p className="text-sm sm:text-base font-normal text-[#394D51] text-center">
                    {whyChooseList?.des}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
