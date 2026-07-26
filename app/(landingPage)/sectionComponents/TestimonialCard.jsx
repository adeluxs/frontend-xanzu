import { RatingStarIcon } from "@/icons";
import Image from "next/image";

const TestimonialCard = ({ testimonial }) => {
  const getStarColor = (star, rating) => {
    if (star <= rating) {
      return "text-[#F2B518]";
    } else {
      return "text-gray-300";
    }
  };

  return (
    <div className="min-h-[260px] relative testimonial-card">
      <div className="testimonial-box min-h-[248px] bg-white relative border p-[8px] rounded-[24px] border-[#E6E9E9] box-shadow-1">
        <div className="p-4 rounded-[16px] bg-[rgba(7,33,38,0.04)]">
          <div className="flex gap-1 items-center mb-3.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= testimonial.rating;
              return (
                <RatingStarIcon
                  key={star}
                  className={`h-5 w-5 transition-all duration-200 ${getStarColor(star, testimonial.rating)}`}
                  opacity={isFilled ? 1 : 0.5}
                />
              );
            })}
          </div>
          <div>
            <p className="text-grayish/80 text-base font-normal leading-normal three-line-ellipsis">
              {testimonial?.review}
            </p>
          </div>
        </div>

        <div className="mt-7.5">
          <div className="flex gap-4 items-center p-2">
            <Image
              src={testimonial?.image}
              alt="testimonial"
              width={50}
              height={50}
              className="w-10 h-10 object-cover"
              unoptimized={typeof testimonial?.image === "string"}
            />
            <div>
              <h6 className="text-grayish text-sm font-semibold">
                {testimonial?.name}
              </h6>
              <p className="text-grayish/60 text-[13px] font-medium">
                {testimonial?.designation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
