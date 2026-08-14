# Frontend SSR, suspension and performance repair

## Fixed production error

Landing-page sections called `startsWith()` directly on optional image values
returned by the backend. Missing section images therefore crashed server-side
rendering. Optional media is now normalized, checked before rendering and given
responsive image sizes. Missing images no longer crash a page.

Metadata title/favicon values and malformed registration settings are also
normalized before use. Root and route error boundaries provide a recoverable
screen for unexpected rendering failures.

## Backend-controlled suspension

- Middleware checks the authoritative `/get-settings` response before routes
  render.
- `service_suspended` accepts boolean, numeric and legacy string values.
- Landing, login, registration and merchant dashboard routes redirect to the
  dedicated `/service-suspended` screen.
- The configured `service_suspension_message` is displayed.
- The shared RTK Query client catches later HTTP 503 `SERVICE_SUSPENDED`
  responses and redirects sessions that were already open.
- **Check again** reloads through middleware; after the backend restore command,
  normal access resumes automatically.

## Performance and reliability

- Cached public settings/content reads retain their five-minute revalidation.
- The suspension check stays fresh so the server command takes effect on the
  next merchant request.
- Middleware no longer calls authenticated `/user` for unrelated public pages.
- The settings provider no longer polls continuously; it reuses RTK Query cache
  and refreshes after reconnect or a stale remount.
- Remote Google Font downloading was removed from production builds. A local
  system font stack avoids external build failures and font-render blocking.
- Responsive `sizes` were added to repaired landing images; below-fold images
  retain Next.js lazy loading.
- Registration/login KYC routing now handles statuses 0, 2 and 3 correctly
  instead of using an impossible chained condition.

## Verification

- `npm run lint`: passed with zero errors.
- `npm run build`: passed using Next.js 15.5.15 and Turbopack.
- The production route manifest includes `/service-suspended`.
- Static checks confirm unsafe landing-page `.startsWith()` calls were removed.

The local HTTP integration probe could not bind/connect across the workspace
sandbox boundary. Production compilation, linting and source-level suspension
contract checks completed successfully.
