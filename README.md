# frontend-xanzu

Next.js 15 admin/merchant dashboard for the Xanzu fintech and e-commerce platform.

## Tech Stack

- Next.js 15 with Turbopack
- React 19
- Tailwind CSS v4
- Redux Toolkit
- ApexCharts
- Flatpickr

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

```bash
npm run build
npm run start
```

## Required environment

Set the Laravel API base URL without a trailing slash:

```env
NEXT_PUBLIC_API_URL=https://your-domain.example/api
```

## Global service suspension

This frontend reads `service_suspended` and `service_suspension_message` from
Laravel `/get-settings`. When suspension is enabled, middleware blocks landing,
authentication and merchant dashboard routes and shows `/service-suspended`.
The shared API client also redirects an already-open session when Laravel
returns HTTP 503 with `code: SERVICE_SUSPENDED`.

Use the Laravel server terminal to control access:

```bash
php artisan service:access suspend --message="Payment has not been made. Please contact the service provider to restore access."
php artisan service:access status
php artisan service:access restore
```

## GitHub: keep generated files out of commits

The included `.gitignore` excludes `node_modules`, `.next`, build output,
caches, logs, private environment files and local editor files at both the
project root and inside nested folders.

If any of these files were committed before `.gitignore` was updated, Git will
continue tracking them until its index is refreshed. Run this once from the
project root. It does not delete the files from your computer:

```bash
git rm -r --cached .
git add .
git status
git commit -m "Stop tracking generated files"
git push
```

Review `git status` before committing. `package.json` and `package-lock.json`
must remain tracked because they define the application dependencies.
