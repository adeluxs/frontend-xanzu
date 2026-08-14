export function normalizeMediaSource(value, fallback = null) {
  if (typeof value !== "string") return fallback;

  const source = value.trim();
  return source || fallback;
}

export function isRemoteMediaSource(value) {
  const source = normalizeMediaSource(value, "");
  return /^https?:\/\//i.test(source);
}

export function backgroundImageStyle(value) {
  const source = normalizeMediaSource(value);
  return source ? { backgroundImage: `url("${source}")` } : undefined;
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
