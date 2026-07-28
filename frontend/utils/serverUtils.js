const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const transformSettingsArray = (settings = []) => {
  return settings.reduce((acc, item) => {
    if (item?.name) {
      acc[item.name] = item.value;
    }

    return acc;
  }, {});
};

export const loadLanguages = async () => {
  try {
    const res = await fetch(`${baseUrl}/get-languages`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Language load error:", err);
    return [];
  }
};

export const getDefaultLanguage = (languages) => {
  return languages.find((lang) => lang.is_default) || languages[0];
};

export const getSelectedLanguage = (languages, locale) => {
  return languages.find((lang) => lang.locale === locale) || languages[0];
};

export const loadSiteSettings = async () => {
  try {
    const res = await fetch(`${baseUrl}/get-settings`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to load settings");
    }

    const data = await res.json();
    return transformSettingsArray(data?.data || []);
  } catch (err) {
    console.error("Settings load error:", err);
    return {};
  }
};

export const buildPageTitle = async (pageTitle) => {
  const settings = await loadSiteSettings();
  const siteTitle = settings?.site_title;

  return siteTitle ? `${pageTitle} - ${siteTitle}` : pageTitle;
};

export const loadLandingData = async (locale = "en") => {
  try {
    const res = await fetch(`${baseUrl}/landing-data/${locale}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to load landing data");
    }

    return res.json();
  } catch (err) {
    console.error("Landing data load error:", err);
    return null;
  }
};

export const loadNavigationData = async (locale = "en") => {
  try {
    const res = await fetch(`${baseUrl}/navigation/${locale}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to load navigation data");
    }

    return res.json();
  } catch (err) {
    console.error("Navigation data load error:", err);
    return null;
  }
};

export const loadPageData = async (pageName) => {
  try {
    const res = await fetch(`${baseUrl}/page-data/${pageName}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error("Failed to load page data");
    }

    return res.json();
  } catch (err) {
    console.error("Page data load error:", err);
    return null;
  }
};
