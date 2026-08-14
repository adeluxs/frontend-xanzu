const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

const apiUrl = (path) => {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return `${baseUrl}${path}`;
};

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
    const res = await fetch(apiUrl("/get-languages"), {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Language request failed (${res.status})`);
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (err) {
    console.error("Language load error:", err);
    return [];
  }
};

export const getDefaultLanguage = (languages = []) => {
  return languages.find((lang) => lang?.is_default) || languages[0];
};

export const getSelectedLanguage = (languages = [], locale) => {
  return languages.find((lang) => lang?.locale === locale) || languages[0];
};

export const loadSiteSettings = async ({ fresh = false } = {}) => {
  try {
    const res = await fetch(apiUrl("/get-settings"), {
      ...(fresh ? { cache: "no-store" } : { next: { revalidate: 300 } }),
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
    const res = await fetch(apiUrl(`/landing-data/${locale}`), {
      next: { revalidate: 300 },
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
    const res = await fetch(apiUrl(`/navigation/${locale}`), {
      next: { revalidate: 300 },
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
    const res = await fetch(apiUrl(`/page-data/${pageName}`), {
      next: { revalidate: 300 },
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
