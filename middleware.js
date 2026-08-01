import { NextResponse } from "next/server";
import { transformSettingsArray } from "./utils/serverUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AUTH_ENTRY_ROUTES = ["/auth/login", "/auth/register"];
const EMAIL_VERIFY_ROUTES = ["/auth/verify-email", "/auth/verify-email-otp"];

const TWO_FA_ROUTE = "/auth/verify-2fa";
const KYC_CHECK_ROUTE = "/auth/kyc-check";
const KYC_RESUBMIT_ROUTE = "/auth/kyc-resubmit";
const MAINTENANCE_ROUTE = "/maintenance";

function isRouteMatch(pathname, routes) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function buildRedirectResponse(request, pathname, clearToken = false) {
  const response = NextResponse.redirect(new URL(pathname, request.url));

  if (clearToken) {
    response.cookies.delete("token");
  }

  return response;
}

async function getJson(endpoint, token, revalidate = 0) {
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    next: revalidate > 0 ? { revalidate } : { noStore: true },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${endpoint}`);
  }

  return response.json();
}

async function resolveAuthenticatedPath(token, settings) {
  const userResponse = await getJson("/user", token);
  const userData = userResponse?.data?.user ?? userResponse?.data;

  if (!userData) {
    throw new Error("User not found");
  }

  const kycStatus = Number(userData.kyc);

  if (
    settings.email_verification === "1" &&
    userData.is_email_verified === false
  ) {
    return "/auth/verify-email";
  }

  if (kycStatus === 2) {
    return "/auth/kyc-check";
  }

  if ([0, 3].includes(kycStatus)) {
    return "/auth/kyc-resubmit";
  }

  if (settings.fa_verification === "1" && userData.two_fa === true) {
    return "/auth/verify-2fa";
  }

  return "/dashboard";
}

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!API_URL) {
    if (pathname === MAINTENANCE_ROUTE) {
      return buildRedirectResponse(request, "/");
    }

    return NextResponse.next();
  }

  let settings = {};

  try {
    const settingsResponse = await getJson("/get-settings", token, 300);
    settings = transformSettingsArray(settingsResponse?.data || []);
  } catch {}

  const isMaintenanceRoute =
    pathname === MAINTENANCE_ROUTE ||
    pathname.startsWith(`${MAINTENANCE_ROUTE}/`);

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isAuthEntryRoute = isRouteMatch(pathname, AUTH_ENTRY_ROUTES);
  const isEmailVerifyRoute = isRouteMatch(pathname, EMAIL_VERIFY_ROUTES);

  const isTwoFaRoute =
    pathname === TWO_FA_ROUTE || pathname.startsWith(`${TWO_FA_ROUTE}/`);

  const isKycCheckRoute =
    pathname === KYC_CHECK_ROUTE || pathname.startsWith(`${KYC_CHECK_ROUTE}/`);

  const isKycResubmitRoute =
    pathname === KYC_RESUBMIT_ROUTE ||
    pathname.startsWith(`${KYC_RESUBMIT_ROUTE}/`);

  const isVerificationRoute =
    isEmailVerifyRoute || isTwoFaRoute || isKycCheckRoute || isKycResubmitRoute;

  const isMaintenanceEnabled = settings.maintenance_mode === "1";

  if (isMaintenanceEnabled) {
    if (!isMaintenanceRoute) {
      return buildRedirectResponse(request, MAINTENANCE_ROUTE);
    }

    return NextResponse.next();
  }

  if (isMaintenanceRoute) {
    return buildRedirectResponse(request, "/");
  }

  if (!token) {
    if (isProtectedRoute || isVerificationRoute) {
      return buildRedirectResponse(request, "/auth/login");
    }

    return NextResponse.next();
  }

  try {
    const redirectPath = await resolveAuthenticatedPath(token, settings);

    if (redirectPath === "/auth/verify-email") {
      if (!isEmailVerifyRoute) {
        return buildRedirectResponse(request, redirectPath);
      }

      return NextResponse.next();
    }

    if (redirectPath === "/auth/kyc-check") {
      if (!isKycCheckRoute) {
        return buildRedirectResponse(request, redirectPath);
      }

      return NextResponse.next();
    }

    if (redirectPath === "/auth/kyc-resubmit") {
      if (!isKycResubmitRoute) {
        return buildRedirectResponse(request, redirectPath);
      }

      return NextResponse.next();
    }

    if (redirectPath === "/auth/verify-2fa") {
      if (isTwoFaRoute || isProtectedRoute) {
        return NextResponse.next();
      }

      return buildRedirectResponse(request, redirectPath);
    }

    if (isAuthEntryRoute || isVerificationRoute) {
      return buildRedirectResponse(request, "/dashboard");
    }
  } catch {
    if (isProtectedRoute || isVerificationRoute || isAuthEntryRoute) {
      return buildRedirectResponse(request, "/auth/login", true);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
