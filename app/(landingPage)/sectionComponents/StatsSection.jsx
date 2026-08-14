import {
  backgroundImageStyle,
  isRemoteMediaSource,
  normalizeMediaSource,
} from "@/utils/media";
import Image from "next/image";

const StatsSection = ({ data, contents = [] }) => {
  const backgroundImage = normalizeMediaSource(data?.background_image);
  const stats =
    contents?.length > 0
      ? contents?.map((stat, index) => ({
          icon: stat?.icon,
          value: stat?.title,
          label: stat?.description,
        }))
      : [];

  return (
    <section
      className="py-8 sm:py-10 md:py-12.5 bg-cover bg-no-repeat bg-center w-full h-full"
      style={backgroundImageStyle(backgroundImage)}
    >
      <div className="custom-container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-start lg:justify-center gap-4"
            >
              {normalizeMediaSource(stat?.icon) && (
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={normalizeMediaSource(stat.icon)}
                    alt="stat icon"
                    width={50}
                    height={50}
                    sizes="36px"
                    className="w-full h-full object-cover"
                    unoptimized={isRemoteMediaSource(stat.icon)}
                  />
                </div>
              )}
              <div>
                <p className="text-white font-bold text-xl md:text-2xl leading-tight mb-1.5 md:mb-2.5">
                  {stat?.value}
                </p>
                <p className="text-white/60 text-base font-normal">
                  {stat?.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
