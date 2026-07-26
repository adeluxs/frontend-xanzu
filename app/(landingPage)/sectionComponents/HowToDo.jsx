import Image from "next/image";

const HowToDo = ({ data }) => {
  const title = data?.title;
  const description = data?.description;
  const rightImage = data?.right_image;
  const bullets = [
    data?.bullet_one,
    data?.bullet_two,
    data?.bullet_three,
    data?.bullet_four,
  ];

  return (
    <section className="section_space-py">
      <div className="custom-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7.5 items-center">
          <div className="w-full xl:w-[80%]">
            <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[52px] leading-[36px] md:leading-[46px] lg:leading-[62px] font-bold text-grayish mb-4">
              {title}
            </h4>
            <div className="editor-content">
              <p>{description}</p>
              <ul>
                {(bullets?.length > 0 ? bullets : []).map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="w-full h-full lg:h-[500px] 3xl:h-[645px] rounded-4xl md:rounded-[100px] overflow-hidden">
              <Image
                src={rightImage}
                alt="pay in 4"
                width={950}
                height={950}
                className="w-full h-full object-cover"
                unoptimized={rightImage.startsWith("http")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToDo;
