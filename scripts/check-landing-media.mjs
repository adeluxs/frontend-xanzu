import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  resolveLandingSections,
  withLandingFallbacks,
} from "../utils/landingFallbacks.js";
import {
  backgroundImageStyle,
  normalizeMediaSource,
} from "../utils/media.js";

const codes = [
  "hero",
  "how-it-works",
  "stats",
  "why-choose-us",
  "about-us",
  "pay-in-4",
  "faq",
  "testimonials",
  "app-link",
];

const collectAssetPaths = (value, paths = new Set()) => {
  if (typeof value === "string" && value.startsWith("/assets/")) {
    paths.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectAssetPaths(item, paths));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectAssetPaths(item, paths));
  }

  return paths;
};

const resolvedSections = codes.map((code) =>
  withLandingFallbacks({ code, data: [], contents: [] }),
);

assert.equal(resolveLandingSections(null).length, codes.length);

for (const section of resolvedSections) {
  assert.equal(Array.isArray(section.data), false, `${section.code} data is an array`);
  assert.ok(
    Object.keys(section.data).length > 0,
    `${section.code} has no fallback data`,
  );
}

const assetPaths = collectAssetPaths(resolvedSections);
for (const assetPath of assetPaths) {
  assert.ok(
    existsSync(join(process.cwd(), "public", assetPath.replace(/^\//, ""))),
    `Missing bundled asset: ${assetPath}`,
  );
}

assert.equal(
  normalizeMediaSource(
    "https://mozapay.app/backend/assets/assets/landing-page/hero-section/hero-img.png",
  ),
  "/assets/landing-page/hero-section/hero-img.png",
);

const layeredBackground = backgroundImageStyle(
  "https://mozapay.app/backend/assets/missing.png",
  "/assets/landing-page/hero-section/hero-bg.png",
);
assert.match(layeredBackground.backgroundImage, /missing\.png/);
assert.match(layeredBackground.backgroundImage, /hero-bg\.png/);

console.log(
  `Landing media check passed: ${resolvedSections.length} sections and ${assetPaths.size} bundled assets verified.`,
);
