import Image from "next/image";

const HeroSection = ({ data }) => {
  const heroTitle = data?.hero_title;
  const heroDescription = data?.hero_description;
  const backgroundImage = data?.background_image;
  const heroImage = data?.hero_image;
  const qrImage = data?.qr_image;
  const qrText = data?.qr_text;

  return (
    <div
      className="pt-[40px] sm:pt-[50px] md:pt-[60px] lg:pt-[70px] xl:pt-[90px] bg-cover bg-no-repeat w-full h-full relative overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="relative custom-container mx-auto">
        <div className="flex flex-col items-center text-center max-w-[581px] mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[72px] font-bold text-grayish leading-tight tracking-tight">
            {heroTitle}
          </h1>
          <p className="mt-3 sm:mt-5 md:mt-7.5 text-grayish/80 text-base md:text-xl leading-relaxed">
            {heroDescription}
          </p>
        </div>

        <div className="mt-[40px] sm:mt-[50px] md:mt-[60px] lg:mt-[70px] xl:mt-[110px] flex sm:flex-row flex-col items-center justify-center gap-5 sm:gap-10 lg:gap-[70px] relative">
          <div className="relative w-[200px] md:w-[324px] h-auto flex-shrink-0 order-2 sm:order-1">
            <Image
              src={heroImage}
              alt="hero"
              width={450}
              height={440}
              className="w-full h-auto object-contain"
              unoptimized={heroImage.startsWith("http")}
            />
          </div>

          <div className="flex-shrink-0 order-1 sm:order-2">
            <div className="rounded-2xl border-2 border-[rgba(7,33,38,0.16)] p-2.5 flex items-center gap-3 sm:gap-4">
              <div className="w-[50px] md:w-[96px] h-[50px] md:h-[96px] flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={qrImage}
                  alt="qr"
                  width={450}
                  height={440}
                  className="w-full h-auto object-contain"
                  unoptimized={qrImage.startsWith("http")}
                />
              </div>
              <p className="text-grayish text-base sm:text-lg md:text-xl font-medium leading-snug whitespace-pre-line w-[40%]">
                {qrText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
