export const getDictionary = async (locale = "en") => {
  try {
    const dictionary = await import(`@/public/locales/${locale}.json`);
    return dictionary.default;
  } catch (error) {
    // fallback to English if file not found
    const fallback = await import(`@/public/locales/en.json`);
    return fallback.default;
  }
};
