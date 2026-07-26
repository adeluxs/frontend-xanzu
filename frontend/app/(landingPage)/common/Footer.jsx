"use client";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

function getSocialIcon(iconName) {
  const normalizedName = iconName?.toLowerCase();

  if (normalizedName === "facebook") {
    return <FacebookIcon />;
  }

  if (normalizedName === "instagram") {
    return <InstagramIcon />;
  }

  if (normalizedName === "linkedin") {
    return <LinkedInIcon />;
  }

  return (
    <span className="text-[11px] font-bold uppercase">
      {iconName?.slice(0, 2) || "S"}
    </span>
  );
}

const Footer = ({ navigationData }) => {
  const footerLinks = (navigationData?.footer_widget_1 || []).map((item) => ({
    href: item?.url,
    label: item?.title,
  }));
  const footerContent = navigationData?.footer_content?.data || {};
  const socialLinks = (navigationData?.footer_content?.contents || []).map(
    (item) => ({
      label: item?.icon_name,
      href: item?.url || "#",
      icon: getSocialIcon(item?.icon_name),
    }),
  );
  const logo = useSelector((state) => state?.settings?.settings?.site_logo);

  return (
    <footer className="w-full bg-[#072126] py-12.5 md:py-[60px]">
      <div className="custom-container mx-auto">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-5 sm:gap-8">
          <div>
            <Link href="/" className="h-[20px] sm:h-[22px] w-auto inline-block">
              {logo ? (
                <Image
                  src={logo}
                  alt="logo"
                  width={150}
                  height={40}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-[120px] h-[22px] bg-gray-300 animate-pulse rounded-md" />
              )}
            </Link>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-5 sm:gap-x-10 lg:gap-x-22 gap-y-3">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link?.href}
                className="text-white text-base hover:text-primary transition-colors duration-200"
              >
                {link?.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social?.href}
                aria-label={social?.label}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-[rgba(255,255,255,0.16)] hover:bg-primary text-white hover:text-grayish"
              >
                <span className="h-5.5 w-5.5 flex justify-center items-center">
                  {social?.icon}
                </span>
              </Link>
            ))}
          </div>

          <div className="w-full border-t border-white/10" />

          <p className="text-[#CFD3D7] text-base text-center">
            {footerContent?.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
