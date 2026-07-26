"use client";
import Button from "@/components/ui/button/Button";
import LanguageDropdown from "@/components/ui/dropdowns/LanguageDropdown";
import { useT } from "@/context/TranslationContext";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import Cookies from "js-cookie";
import { MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Header = ({ navigationData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const { data: user } = useGetUserQuery(undefined, {
    skip: !hasToken,
  });
  const siteTwoFa = useSelector(
    (state) => state.settings.settings.fa_verification,
  );
  const siteEmailVerification = useSelector(
    (state) => state.settings.settings.email_verification,
  );
  const logo = useSelector(
    (state) => state?.settings?.settings?.site_logo_dark,
  );
  const t = useT();

  useEffect(() => {
    setHasToken(Boolean(Cookies.get("token")));
  }, []);

  const userData = user?.data?.user ?? user?.data;

  let ctaLabel = t("auth.becomeMerchant");
  let ctaHref = "/auth/login";

  if (hasToken) {
    if (
      userData &&
      siteEmailVerification === "1" &&
      userData.is_email_verified === false
    ) {
      ctaHref = "/auth/verify-email";
    } else if (userData && siteTwoFa === "1" && userData.two_fa === true) {
      ctaHref = "/auth/verify-2fa";
    } else {
      ctaLabel = "Dashboard";
      ctaHref = "/dashboard";
    }
  }

  const menus = (navigationData?.header || []).map((item) => ({
    name: item?.title,
    url: item?.url,
  }));

  return (
    <div className="relative bg-white border-b border-grayish/10">
      <header className="custom-container mx-auto">
        <div className="flex gap-2 justify-between items-center h-[76px] lg:h-[92px]">
          <div className="flex items-center gap-10 3xl:gap-15">
            <Link href="/" className="h-[20px] sm:h-[22px] w-auto">
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

            <div className="md:flex hidden items-center gap-6 xl:gap-12.5">
              {menus?.map((menu, index) => (
                <Link
                  key={index}
                  href={menu?.url}
                  className="text-base font-medium text-grayish"
                >
                  {menu?.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageDropdown isOnlyIcon={false} />
            <div className="sm:block hidden">
              <Button
                type="button"
                variant="primary-filled"
                size="xs"
                className="h-[44px] px-[24px]"
                rounded="md"
                href={ctaHref}
              >
                {ctaLabel}
              </Button>
            </div>
            <button
              className="md:hidden block text-grayish/70"
              onClick={toggleMenu}
            >
              {isOpen ? (
                <X className="h-6 w-auto" />
              ) : (
                <MenuIcon className="h-6 w-auto" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu backdrop */}
      <div
        className={`fixed inset-0 top-[76px] bg-black bg-opacity-50 z-100 xl:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* mobile sidebar menu */}
      <aside
        className={`fixed top-[76px] left-0 h-full overflow-auto w-64 sm:w-74 bg-white shadow-xl z-100 transform transition-transform duration-300 ease-in-out xl:hidden p-3 border-t border-grayish/16 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {menus.map((menu, index) => (
          <Link
            key={index}
            href={menu.url}
            onClick={closeMenu}
            className="h-10 px-3 2xl:px-4 flex items-center gap-1.5 rounded-lg text-sm font-semibold text-grayish hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            {menu.name}
          </Link>
        ))}
        <div className="block sm:hidden sm:mt-0 mt-3">
          <Button
            type="button"
            variant="primary-filled"
            size="xs"
            className="h-[44px] px-[24px]"
            rounded="md"
            href={ctaHref}
          >
            {ctaLabel}
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default Header;
