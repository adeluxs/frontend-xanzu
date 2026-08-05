import AboutUs from "../sectionComponents/AboutUs";
import AppLinkSection from "../sectionComponents/AppLinkSection";
import FaqSection from "../sectionComponents/FaqSection";
import HeroSection from "../sectionComponents/HeroSection";
import HowItWorks from "../sectionComponents/HowItWorks";
import HowToDo from "../sectionComponents/HowToDo";
import StatsSection from "../sectionComponents/StatsSection";
import Testimonial from "../sectionComponents/Testimonial";
import WhyChooseUs from "../sectionComponents/WhyChooseUs";

const LandingPage = ({ landingData }) => {
  const sections = landingData?.sections || [];

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-grayish/60 text-base font-medium">No data available</p>
      </div>
    );
  }

  const renderSection = (section) => {
    const data = section?.data || {};
    const contents = section?.contents || [];

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
