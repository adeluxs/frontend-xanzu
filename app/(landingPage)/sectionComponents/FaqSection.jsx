"use client";

import { DownArrowIcon, QuestionIcon, UpArrowIcon } from "@/icons";
import { useEffect, useState } from "react";
import { backgroundImageStyle, normalizeMediaSource } from "@/utils/media";

const FaqSection = ({ data, contents = [] }) => {
  const faqData = contents?.length > 0 ? contents : [];
  const [openIndex, setOpenIndex] = useState(faqData.length > 0 ? 0 : null);
  const title = data?.title;
  const backgroundImage = normalizeMediaSource(data?.background_image);

  useEffect(() => {
    setOpenIndex(faqData.length > 0 ? 0 : null);
  }, [faqData?.length]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="section_space-py bg-cover bg-no-repeat bg-center w-full h-full"
      style={backgroundImageStyle(backgroundImage)}
      id="faq"
    >
      <div className="custom-container mx-auto">
        <div className="max-w-xl mx-auto title_mb">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[52px] leading-[36px] md:leading-[46px] lg:leading-[62px] font-bold text-grayish text-center">
            {title}
          </h2>
        </div>
        <div className="mx-auto max-w-[870px]">
          <div className="space-y-0">
            {faqData.map((faq, index) => (
              <div key={faq?.id || index} className="bg-transparent">
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full ${openIndex === index ? "py-4" : "py-4 lg:py-5 xl:py-7.5"} flex items-center justify-between text-left`}
                >
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div
                      className={`h-5 w-5 flex justify-center items-center border-2 border-[#596A6E] rounded-[5px] text-[#596A6E] ${openIndex === index ? "bg-[#072126] text-primary" : ""}`}
                    >
                      <QuestionIcon className="h-3 w-3" />
                    </div>
                    <h3 className="text-base xl:text-lg font-semibold text-grayish ltr:flex-1">
                      {faq?.title}
                    </h3>
                  </div>
                  <div className="ms-4 flex-shrink-0">
                    {openIndex === index ? (
                      <DownArrowIcon className="h-6 w-6 text-grayish" />
                    ) : (
                      <UpArrowIcon className="h-6 w-6 text-grayish" />
                    )}
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-7.5">
                      <p className="text-base text-grayish/80 font-normal">
                        {faq?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
