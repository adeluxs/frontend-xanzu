"use client";

import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { LeftArrowIcon, RightArrowIcon } from "@/icons";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TestimonialCard from "./TestimonialCard";

const Testimonial = ({ data, contents = [] }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const dir = useDocumentDirection();
  const title = data?.testimonial_title;
  const testimonials =
    contents?.length > 0
      ? contents?.map((item, index) => ({
          id: item?.id || index,
          name: item?.name,
          designation: item?.designation,
          image: item?.picture,
          imageFallback: `/assets/landing-page/testimonials-section/testimonial-user-${(index % 3) + 1}.svg`,
          rating: Number(item?.star || 5),
          review: item?.description || "",
        }))
      : [];

  return (
    <section className="section_space-py">
      <div className="custom-container mx-auto">
        <div className="title_mb flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-end">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[52px] leading-[36px] md:leading-[46px] lg:leading-[62px] font-bold text-grayish w-full lg:w-[60%] xl:w-[50%]">
            {title}
          </h3>
          <div className="flex items-center gap-4">
            <button
              ref={prevRef}
              type="button"
              aria-label="Previous testimonial"
              disabled={!canPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(7,33,38,0.12)] bg-[rgba(7,33,38,0.04)] text-grayish transition-all duration-300 hover:bg-primary hover:border-primary disabled:cursor-not-allowed disabled:border-[rgba(7,33,38,0.08)] disabled:bg-[rgba(7,33,38,0.02)] disabled:text-grayish/40 disabled:hover:bg-[rgba(7,33,38,0.02)] disabled:hover:border-[rgba(7,33,38,0.08)] rtl:rotate-180"
            >
              <LeftArrowIcon />
            </button>
            <button
              ref={nextRef}
              type="button"
              aria-label="Next testimonial"
              disabled={!canNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(7,33,38,0.12)] bg-[rgba(7,33,38,0.04)] text-grayish transition-all duration-300 hover:bg-primary hover:border-primary disabled:cursor-not-allowed disabled:border-[rgba(7,33,38,0.08)] disabled:bg-[rgba(7,33,38,0.02)] disabled:text-grayish/40 disabled:hover:bg-[rgba(7,33,38,0.02)] disabled:hover:border-[rgba(7,33,38,0.08)] rtl:rotate-180"
            >
              <RightArrowIcon />
            </button>
          </div>
        </div>
        <Swiper
          key={dir}
          dir={dir}
          slidesPerView={1}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onSwiper={(swiper) => {
            setCanPrev(!swiper.isBeginning);
            setCanNext(!swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setCanPrev(!swiper.isBeginning);
            setCanNext(!swiper.isEnd);
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            567: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="myTestimonialsSwiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
