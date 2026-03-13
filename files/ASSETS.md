# Required Image & Asset Files

> All image/asset placeholders currently in the codebase that need real files.

---

## Static Assets

| # | File Name | Folder Path | Description | Where It's Used |
|---|-----------|-------------|-------------|-----------------|
| 1 | `favicon.svg` | `frontend/public/` | **App favicon / browser tab icon.** A small, clean ManaDriver brand mark (e.g. a steering wheel or "M" monogram) in dark teal (`#083344`) and accent green (`#10B981`). SVG for crisp retina rendering. Replace the default `vite.svg`. | [index.html](site/frontend/index.html#L5) — `<link rel="icon">` tag |
| 2 | `og-image.png` | `frontend/public/` | **Social share / Open Graph image.** 1200×630 px. Shows the ManaDriver brand name, tagline ("Hire a Verified Driver, Anytime"), and a visual of a driver or car on a mint-green background. Used when the URL is shared on social media. | Needs to be added to `<head>` in [index.html](site/frontend/index.html) |
| 3 | `apple-touch-icon.png` | `frontend/public/` | **iOS home screen icon.** 180×180 px. Same brand mark as the favicon on a solid dark teal or white background. | Needs to be added to `<head>` in [index.html](site/frontend/index.html) |

---

## Landing Page — Hero Section

| # | File Name | Folder Path | Description | Where It's Used |
|---|-----------|-------------|-------------|-----------------|
| 4 | `hero-illustration.svg` _(or `.png`/`.webp`)_ | `frontend/src/assets/` | **Hero illustration / image.** A friendly, modern illustration or photo showing a professional driver standing beside (or driving) a car. Should convey trust and reliability. Mint-green (`#ECFDF5`) tones complement the hero background. Recommended size: ~600×480 px. | [LandingPage.tsx → HeroSection](site/frontend/src/pages/public/LandingPage.tsx#L67) — replaces the `<Car>` icon placeholder |

---

## Landing Page — Service Areas Section

| # | File Name | Folder Path | Description | Where It's Used |
|---|-----------|-------------|-------------|-----------------|
| 5 | `india-map.svg` _(or `.png`/`.webp`)_ | `frontend/src/assets/` | **India map illustration.** A simplified, stylised map of India with marker dots or highlights on serviced cities (Mumbai, Delhi, Bangalore, etc.). Uses accent green markers on a neutral/white background. ~500×400 px. | [LandingPage.tsx → ServiceAreasSection](site/frontend/src/pages/public/LandingPage.tsx#L288) — replaces the `<MapPin>` icon placeholder |

---

## Landing Page — App Download Section

| # | File Name | Folder Path | Description | Where It's Used |
|---|-----------|-------------|-------------|-----------------|
| 6 | `phone-mockup.png` _(or `.webp`)_ | `frontend/src/assets/` | **Phone mockup image.** A realistic smartphone mock-up displaying the ManaDriver app interface (e.g. the driver booking screen or dashboard). Angled or straight-on view. Transparent or light (`#F8FAFC`) background. ~400×600 px. | [LandingPage.tsx → AppDownloadSection](site/frontend/src/pages/public/LandingPage.tsx#L450) — replaces the `<PhoneCall>` icon placeholder |

---

## Navbar — Logo

| # | File Name | Folder Path | Description | Where It's Used |
|---|-----------|-------------|-------------|-----------------|
| 7 | `logo.svg` | `frontend/src/assets/` | **ManaDriver wordmark / logo.** A clean wordmark saying "ManaDriver" in dark teal (`#083344`), optionally with a small icon (steering wheel, road, car). Currently the navbar renders "ManaDriver" as plain text — this image would upgrade it to a proper brand logo. ~160×40 px. | [navbar.tsx](site/frontend/src/components/layout/navbar.tsx#L42) — replaces the text-only `<Link>` logo |

---

## Empty States (Dashboard)

| # | File Name | Folder Path | Description | Where It's Used |
|---|-----------|-------------|-------------|-----------------|
| 8 | `empty-jobs.svg` | `frontend/src/assets/` | **No jobs found illustration.** A light, friendly illustration of an empty clipboard or empty road. Grey/muted tones. ~240×200 px. | EmptyState in [BrowseJobsTab.tsx](site/frontend/src/pages/driver/BrowseJobsTab.tsx#L177), [MyJobsTab.tsx](site/frontend/src/pages/customer/MyJobsTab.tsx#L158) |
| 9 | `empty-applications.svg` | `frontend/src/assets/` | **No applications illustration.** An illustration of an empty inbox or empty envelope. Grey/muted tones. ~240×200 px. | EmptyState in [MyJobsTab.tsx](site/frontend/src/pages/customer/MyJobsTab.tsx#L311) (no applicants yet) |
| 10 | `empty-active-job.svg` | `frontend/src/assets/` | **No active job illustration.** An illustration of a parked car or idle steering wheel. Grey/muted tones. ~240×200 px. | EmptyState in [ActiveJobTab.tsx](site/frontend/src/pages/driver/ActiveJobTab.tsx#L97) |
| 11 | `empty-completed.svg` | `frontend/src/assets/` | **No completed jobs illustration.** An illustration of an empty checklist or trophy outline. Grey/muted tones. ~240×200 px. | EmptyState in [CompletedJobsTab.tsx (driver)](site/frontend/src/pages/driver/CompletedJobsTab.tsx#L59), [CompletedJobsTab.tsx (customer)](site/frontend/src/pages/customer/CompletedJobsTab.tsx#L119) |

---

## User Avatars (Dynamic — no static file needed)

| # | Source | Description | Where It's Used |
|---|--------|-------------|-----------------|
| — | Cloudinary (uploaded at runtime) | Driver profile photos / avatars are uploaded during onboarding and stored in Cloudinary. Served as dynamic URLs. **No static file required.** | [applicant-card.tsx](site/frontend/src/components/shared/applicant-card.tsx#L10), [avatar.tsx](site/frontend/src/components/ui/avatar.tsx#L37) |

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Static / public assets (favicon, OG, touch icon) | 3 | Need to create |
| Landing page visuals (hero, map, phone mockup) | 3 | Need to create (currently icon placeholders) |
| Brand logo | 1 | Need to create (currently plain text) |
| Empty-state illustrations | 4 | Need to create (currently icon-only) |
| **Total static assets needed** | **11** | — |
| Dynamic avatars (Cloudinary) | — | Already handled by backend |
