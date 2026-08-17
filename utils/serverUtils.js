const getBaseUrl = () => {
  const configuredUrl =
    typeof window === "undefined"
      ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL;

  return (configuredUrl || "").replace(/\/+$/, "");
};

const apiUrl = (path) => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error(
      "API URL is not configured. Set API_URL and NEXT_PUBLIC_API_URL.",
    );
  }

  return `${baseUrl}${path}`;
};

const debugEnabled =
  typeof window === "undefined" && process.env.FRONTEND_API_DEBUG === "true";

const responseExcerpt = (body) =>
  body.replace(/\s+/g, " ").trim().slice(0, 500) || "<empty response>";

const requestJson = async (label, path, options = {}) => {
  const url = apiUrl(path);
  const startedAt = Date.now();
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    console.error(`[API:${label}] network request failed`, {
      url,
      duration_ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  const body = await response.text();
  const requestId = response.headers.get("x-request-id");
  const details = {
    url,
    status: response.status,
    status_text: response.statusText,
    request_id: requestId || undefined,
    content_type: response.headers.get("content-type") || undefined,
    duration_ms: Date.now() - startedAt,
  };

  if (!response.ok) {
    console.error(`[API:${label}] request failed`, {
      ...details,
      response: responseExcerpt(body),
    });
    throw new Error(`${label} request failed (${response.status})`);
  }

  try {
    const data = body ? JSON.parse(body) : null;

    if (debugEnabled) {
      console.info(`[API:${label}] request succeeded`, details);
    }

    return data;
  } catch (error) {
    console.error(`[API:${label}] invalid JSON response`, {
      ...details,
      response: responseExcerpt(body),
    });
    throw error;
  }
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
    const data = await requestJson("languages", "/get-languages", {
      next: { revalidate: 300 },
    });
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

export const loadSiteSettings = async () => {
  try {
    const data = await requestJson("settings", "/get-settings", {
      cache: "no-store",
    });
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
    return await requestJson("landing", `/landing-data/${locale}`, {
      cache: "no-store",
    });
  } catch (err) {
    console.error("Landing data load error:", err);
    return null;
  }
};

export const loadNavigationData = async (locale = "en") => {
  try {
    return await requestJson("navigation", `/navigation/${locale}`, {
      cache: "no-store",
    });
  } catch (err) {
    console.error("Navigation data load error:", err);
    return null;
  }
};

export const loadPageData = async (pageName) => {
  try {
    return await requestJson("page", `/page-data/${pageName}`, {
      next: { revalidate: 300 },
    });
  } catch (err) {
    console.error("Page data load error:", err);
    return null;
  }
};
