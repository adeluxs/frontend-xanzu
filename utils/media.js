const frontendPublicAssetFolders = new Set([
  "auth-page",
  "common",
  "dashboard-page",
  "error",
  "gif",
  "landing-page",
  "other-page",
]);

const backendAssetFolders = new Set([
  "backend",
  "front",
  "frontend",
  "global",
  "kyc",
  "storage",
]);

const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

const getAssetBaseUrl = () => {
  const explicitUrl = process.env.NEXT_PUBLIC_ASSET_URL;
  if (explicitUrl?.trim()) return trimTrailingSlashes(explicitUrl.trim());

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window === "undefined" ? process.env.API_URL : "");

  if (!apiUrl?.trim()) return "";

  try {
    const parsed = new URL(apiUrl.trim());
    const apiPath = parsed.pathname.replace(/\/api\/?$/i, "");
    parsed.pathname = `${trimTrailingSlashes(apiPath)}/assets`;
    parsed.search = "";
    parsed.hash = "";
    return trimTrailingSlashes(parsed.toString());
  } catch {
    return "";
  }
};

const isFrontendPublicAsset = (pathname) => {
  const match = pathname.match(/^\/assets\/([^/]+)/i);
  return match ? frontendPublicAssetFolders.has(match[1].toLowerCase()) : false;
};

const isBackendAssetPath = (pathname) => {
  const firstFolder = pathname
    .replace(/^\/+/, "")
    .replace(/^assets\//i, "")
    .split("/")[0]
    ?.toLowerCase();
  return backendAssetFolders.has(firstFolder);
};

const joinAssetUrl = (pathname) => {
  const assetBaseUrl = getAssetBaseUrl();
  let normalizedPath = pathname
    .replace(/\\/g, "/")
    .replace(/^public\//i, "")
    .replace(/^\/+/, "")
    .replace(/^assets\//i, "");

  if (/^backend\/(backend|front|frontend|global|kyc|storage)\//i.test(normalizedPath)) {
    normalizedPath = normalizedPath.replace(/^backend\//i, "");
  }

  return assetBaseUrl
    ? `${assetBaseUrl}/${normalizedPath}`
    : `/assets/${normalizedPath}`;
};

export function normalizeMediaSource(value, fallback = null) {
  if (typeof value !== "string") {
    return typeof fallback === "string"
      ? normalizeMediaSource(fallback, null)
      : fallback;
  }

  const source = value.trim();
  if (!source) {
    return typeof fallback === "string"
      ? normalizeMediaSource(fallback, null)
      : fallback;
  }

  if (/^(data:|blob:)/i.test(source)) return source;

  const normalizedSource = source.replace(/\\/g, "/");
  const candidate = /^\/\//.test(normalizedSource)
    ? `https:${normalizedSource}`
    : normalizedSource;

  if (/^https?:\/\//i.test(candidate)) {
    try {
      const parsed = new URL(candidate);

      const nestedFrontendAsset = parsed.pathname.match(
        /\/backend\/assets\/assets\/([^/]+)\/(.*)/i,
      );
      if (
        nestedFrontendAsset &&
        frontendPublicAssetFolders.has(nestedFrontendAsset[1].toLowerCase())
      ) {
        return `/assets/${nestedFrontendAsset[1]}/${nestedFrontendAsset[2]}`;
      }

      if (isFrontendPublicAsset(parsed.pathname)) {
        return parsed.pathname;
      }

      if (/\/backend\/assets\//i.test(parsed.pathname)) {
        return candidate;
      }

      const assetBaseUrl = getAssetBaseUrl();
      const assetHost = assetBaseUrl
        ? new URL(assetBaseUrl).hostname.toLowerCase()
        : "";
      const sourceHost = parsed.hostname.toLowerCase();
      const shouldRepairBackendUrl =
        isBackendAssetPath(parsed.pathname) &&
        (sourceHost === assetHost ||
          sourceHost === "localhost" ||
          sourceHost === "127.0.0.1");

      return shouldRepairBackendUrl ? joinAssetUrl(parsed.pathname) : candidate;
    } catch {
      return typeof fallback === "string"
        ? normalizeMediaSource(fallback, null)
        : fallback;
    }
  }

  const pathWithoutPublic = normalizedSource.replace(/^\/?public\//i, "");
  const browserPath = `/${pathWithoutPublic.replace(/^\/+/, "")}`;

  if (isFrontendPublicAsset(browserPath)) return browserPath;
  if (/^\/backend\/assets\//i.test(browserPath)) return browserPath;

  return joinAssetUrl(browserPath);
}

export function isRemoteMediaSource(value) {
  const source = normalizeMediaSource(value, "");
  return /^https?:\/\//i.test(source);
}

export function backgroundImageStyle(value, fallback = null) {
  const sources = [
    normalizeMediaSource(value),
    normalizeMediaSource(fallback),
  ].filter((source, index, allSources) => source && allSources.indexOf(source) === index);

  return sources.length > 0
    ? { backgroundImage: sources.map((source) => `url("${source}")`).join(", ") }
    : undefined;
}

export function normalizeLinkHref(value, fallback = "#") {
  if (typeof value !== "string") return fallback;

  const href = value.trim();
  if (!href) return fallback;

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href) ||
    /^tel:/i.test(href)
  ) {
    return href;
  }

  return fallback;
}
