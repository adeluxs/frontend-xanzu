import { NextResponse } from "next/server";
import { transformSettingsArray } from "./utils/serverUtils";

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  ""
).replace(/\/+$/, "");

const API_DEBUG = process.env.FRONTEND_API_DEBUG === "true";

const AUTH_ENTRY_ROUTES = ["/auth/login", "/auth/register"];
const EMAIL_VERIFY_ROUTES = ["/auth/verify-email", "/auth/verify-email-otp"];

const TWO_FA_ROUTE = "/auth/verify-2fa";
const KYC_CHECK_ROUTE = "/auth/kyc-check";
const KYC_RESUBMIT_ROUTE = "/auth/kyc-resubmit";
const MAINTENANCE_ROUTE = "/maintenance";
const SUSPENSION_ROUTE = "/service-suspended";

function isEnabled(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  return ["1", "true", "yes", "on", "enabled", "active"].includes(
    String(value ?? "")
      .trim()
      .toLowerCase(),
  );
}

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
  const url = `${API_URL}${endpoint}`;
  const startedAt = Date.now();
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, {
      headers,
      ...(revalidate > 0
        ? { next: { revalidate } }
        : { cache: "no-store" }),
    });
  } catch (error) {
    console.error("[API:proxy] network request failed", {
      url,
      duration_ms: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  const body = await response.text();
  const details = {
    url,
    status: response.status,
    status_text: response.statusText,
    request_id: response.headers.get("x-request-id") || undefined,
    content_type: response.headers.get("content-type") || undefined,
    duration_ms: Date.now() - startedAt,
  };

  if (!response.ok) {
    console.error("[API:proxy] request failed", {
      ...details,
      response:
        body.replace(/\s+/g, " ").trim().slice(0, 500) || "<empty response>",
    });
    throw new Error(`Request failed for ${endpoint} (${response.status})`);
  }

  if (API_DEBUG) {
    console.info("[API:proxy] request succeeded", details);
  }

  try {
    return body ? JSON.parse(body) : null;
  } catch (error) {
    console.error("[API:proxy] invalid JSON response", {
      ...details,
      response:
        body.replace(/\s+/g, " ").trim().slice(0, 500) || "<empty response>",
    });
    throw error;
  }
}

async function resolveAuthenticatedPath(token, settings) {
  const userResponse = await getJson("/user", token);
  const userData = userResponse?.data?.user ?? userResponse?.data;

  if (!userData) {
    throw new Error("User not found");
  }

  const kycStatus = Number(userData.kyc);

  if (
    isEnabled(settings.email_verification) &&
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

  if (isEnabled(settings.fa_verification) && userData.two_fa === true) {
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
    // This read stays fresh because it is the authority for the global lock.
    // The backend settings model is cached and flushed by service:access.
    const settingsResponse = await getJson("/get-settings");
    settings = transformSettingsArray(settingsResponse?.data || []);
  } catch {}

  const isSuspensionRoute =
    pathname === SUSPENSION_ROUTE ||
    pathname.startsWith(`${SUSPENSION_ROUTE}/`);
  const isServiceSuspended = isEnabled(settings.service_suspended);

  if (isServiceSuspended) {
    if (!isSuspensionRoute) {
      return buildRedirectResponse(request, SUSPENSION_ROUTE);
    }

    return NextResponse.next();
  }

  if (isSuspensionRoute) {
    return buildRedirectResponse(request, "/");
  }

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

  const isMaintenanceEnabled = isEnabled(settings.maintenance_mode);

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

  // Public pages do not need an authenticated /user round trip. The header
  // performs its own cached client query when it needs account information.
  if (!isProtectedRoute && !isVerificationRoute && !isAuthEntryRoute) {
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
