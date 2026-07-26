import { cookies } from "next/headers";

export async function getLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  return locale;
}
