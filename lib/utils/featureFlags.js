const enabledValues = new Set([
  "1",
  "true",
  "yes",
  "on",
  "enabled",
  "active",
]);

/**
 * Normalize feature flags returned by Laravel across boolean, numeric and
 * legacy string representations.
 */
export const isFeatureEnabled = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  return enabledValues.has(String(value ?? "").trim().toLowerCase());
};
