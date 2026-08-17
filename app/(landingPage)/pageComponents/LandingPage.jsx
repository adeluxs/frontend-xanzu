import AboutUs from "../sectionComponents/AboutUs";
import AppLinkSection from "../sectionComponents/AppLinkSection";
import FaqSection from "../sectionComponents/FaqSection";
import HeroSection from "../sectionComponents/HeroSection";
import HowItWorks from "../sectionComponents/HowItWorks";
import HowToDo from "../sectionComponents/HowToDo";
import StatsSection from "../sectionComponents/StatsSection";
import Testimonial from "../sectionComponents/Testimonial";
import WhyChooseUs from "../sectionComponents/WhyChooseUs";
import { resolveLandingSections } from "@/utils/landingFallbacks";

const LandingPage = ({ landingData }) => {
  const sections = resolveLandingSections(landingData?.sections);

  const renderSection = (section) => {
    const data = section.data;
    const contents = section.contents;

    switch (section?.code) {
      case "hero":
        return <HeroSection data={data} />;
      case "how-it-works":
        return <HowItWorks data={data} contents={contents} />;
      case "stats":
        return <StatsSection data={data} contents={contents} />;
      case "why-choose-us":
        return <WhyChooseUs data={data} contents={contents} />;
      case "about-us":
        return <AboutUs data={data} contents={contents} />;
      case "pay-in-4":
        return <HowToDo data={data} />;
      case "faq":
        return <FaqSection data={data} contents={contents} />;
      case "testimonials":
        return <Testimonial data={data} contents={contents} />;
      case "app-link":
        return <AppLinkSection data={data} />;
      default:
        return null;
    }
  };

  return (
    <div data-locale={landingData?.language || "en"}>
      {sections?.map((section) => (
        <div key={section?.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default LandingPage;
