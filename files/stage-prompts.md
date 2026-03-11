# Stage-by-Stage Agent Prompts
# Driver Hiring & Management Platform

> Paste each prompt into the agent when you're ready to start that stage.
> Always attach PRD.md, DESIGN.md, TECH_STACK.md, and TODO.md with every prompt.

---

## PHASE 1 — Validation Prototype

---

**Stage 1 — Project Setup & Repo Structure**
```
Complete Phase 1 Stage 1 from TODO.md. Set up the monorepo with /frontend (React 18 + TypeScript + Vite + Tailwind + ShadCN) and /backend (Node.js + Express + TypeScript) folder structures, install all dependencies, create config files, and add .env.example files for both. Reference TECH_STACK.md for the exact folder structure and dependency list.
```

---

**Stage 2 — Design System & Reusable UI Components**
```
Complete Phase 1 Stage 2 from TODO.md. Configure Tailwind with all design tokens from DESIGN.md (colors, typography, spacing, shadows, border radius), set up globals.css, and build every reusable component listed — Button, Card, Input, Select, Textarea, Modal, Badge, Accordion, Tabs, StatCard, JobCard, ApplicantCard, NotificationBell, Avatar, RatingStars, EmptyState, Loader, Skeleton, Toast, Navbar, Footer, and PageWrapper. Reference DESIGN.md for exact specs on each component.
```

---

**Stage 3 — Public Landing Page**
```
Complete Phase 1 Stage 3 from TODO.md. Build the full single-page scrollable landing page with all 11 sections: Hero, Stats, Why Choose Us, Services, Safety, Service Areas, FAQ, Driver Partner Banner, Business Banner, App Download, and Footer. Use the reusable components from Stage 2. Reference DESIGN.md sections 1.1 to 1.12 for layout, copy, and color specs. Ensure all sections are fully responsive at desktop, tablet, and mobile breakpoints.
```

---

**Stage 4 — Backend: Core Models & DB Setup**
```
Complete Phase 1 Stage 4 from TODO.md. Set up the MongoDB Atlas connection, Cloudinary config, and create all 6 Mongoose models: User, DriverProfile, CustomerProfile, Job, Application, Rating, and Notification. Include all fields exactly as defined in TECH_STACK.md, including Phase 2 placeholder fields (paymentId, location GeoJSON) set to null. Set up the standardized API response utility, Express app.ts, and server.ts.
```

---

**Stage 5 — Backend: Auth API**
```
Complete Phase 1 Stage 5 from TODO.md. Build JWT utilities (generate/verify access and refresh tokens), bcrypt utilities, auth middleware (JWT verification + req.user), role middleware (requireRole), and the full auth controller with signup, login, logout, and getMe. Mount all routes at /api/auth. Apply Phase 1 stubs: no email verification, no OTP, JWT stored in localStorage.
```

---

**Stage 6 — Authentication Frontend**
```
Complete Phase 1 Stage 6 from TODO.md. Create TypeScript interfaces, constants, Axios service with JWT interceptors, AuthContext with login/signup/logout, Signup page (with Driver/Customer role toggle cards), Login page, ProtectedRoute and RoleRoute components, and full React Router v6 setup in App.tsx. Update the Navbar to show the correct authenticated/unauthenticated states.
```

---

**Stage 7 — Driver Onboarding Flow**
```
Complete Phase 1 Stage 7 from TODO.md. Build the Multer + Cloudinary upload middleware on the backend and all driver profile routes (GET/POST/PATCH profile, POST documents). On the frontend, build the 4-step onboarding form: Step 1 Personal Info, Step 2 Location with multi-select chip areas, Step 3 Vehicle Skills with toggle chips, Step 4 Document Upload with react-dropzone (idle → uploading → uploaded states). Include the progress bar and final submit flow. Reference DESIGN.md section 3 for UI specs.
```

---

**Stage 8 — Customer Profile Setup**
```
Complete Phase 1 Stage 8 from TODO.md. Build the customer profile backend routes (GET/POST/PATCH /api/customer/profile) and the frontend ProfileSetupPage with required fields (Name, Phone, Email, City) and optional fields (Car Make/Model, Preferred Transmission). On save, mark isProfileComplete true and redirect to the Customer Dashboard.
```

---

**Stage 9 — Job Posting System**
```
Complete Phase 1 Stage 9 from TODO.md. Build the full job creation backend (createJob, getJobs, getJobById, updateJobStatus controllers and routes). On the frontend, build the PostJobTab inside the Customer Dashboard with a job type toggle (Hourly / Temporary / Permanent) and dynamic form fields for each type using react-hook-form + zod. Reference PRD.md section P1.4 for the exact fields per job type.
```

---

**Stage 10 — Job Marketplace**
```
Complete Phase 1 Stage 10 from TODO.md. Implement job filtering in the getJobs controller (city, jobType, carType, transmissionType, min/max pay). Build the BrowseJobsTab for the Driver Dashboard with a filter bar and a grid of JobCard components. Applied jobs show an "Applied" badge with a disabled button. Create the useJobs hook.
```

---

**Stage 11 — Application System**
```
Complete Phase 1 Stage 11 from TODO.md. Build the full applications backend: applyToJob, getDriverApplications, getJobApplicants (sorted first-applied-first, ties by rating), and updateApplication (hire, auto-reject others, auto-close driver's other pending applications). On the frontend, build the applicant list modal for customers and the MyApplicationsTab for drivers with Accept Job and Decline buttons on approved cards. Create the useApplications hook.
```

---

**Stage 12 — Driver & Customer Dashboards**
```
Complete Phase 1 Stage 12 from TODO.md. Build the full DriverDashboard with 4 tabs (Browse Jobs, My Applications, Active, Completed) and the full CustomerDashboard with 3 tabs (Post a Job, My Jobs, Completed). Wire up all tab content using components and hooks built in previous stages. Reference DESIGN.md sections 5 and 6 for exact layout and card specs.
```

---

**Stage 13 — Job Status Lifecycle**
```
Complete Phase 1 Stage 13 from TODO.md. Implement the full job status transition logic in the backend: posted → applied → accepted → in_progress → completed (and → cancelled at any active stage). Validate transitions and reject invalid ones. Create notifications on each status change. Wire up Mark as Completed and status change buttons on both dashboards. Display status badges everywhere.
```

---

**Stage 14 — Rating & Review System**
```
Complete Phase 1 Stage 14 from TODO.md. Build the ratings backend (createRating with duplicate prevention, auto-calculated overallRating, averageRating update on DriverProfile/CustomerProfile) and the RatingModal frontend component (3 star categories: Driving Skill, Professional Behavior, Punctuality + optional text review). Integrate the modal into the Customer Completed tab for unrated jobs.
```

---

**Stage 15 — Notifications (Polling-Based)**
```
Complete Phase 1 Stage 15 from TODO.md. Create the notification service helper and wire up notification creation calls across all relevant events in existing controllers (driver applied, hired, rejected, accepted, declined, job completed, new job in area). Build the notifications backend routes. Create NotificationContext with 30s polling, the useNotifications hook, and the NotificationBell slide-in panel UI with mark-all-read. This is a Phase 1 stub — will be replaced with Socket.io in Phase 2.
```

---

**Stage 16 — Cancellation Flow**
```
Complete Phase 1 Stage 16 from TODO.md. Implement cancellation logic in the backend (either party can cancel accepted or in_progress jobs, optional reason field, notifications to both parties, no financial penalty in Phase 1). Add a Cancel Job button with a confirmation modal on the Active tab (driver) and My Jobs tab (customer). Show cancelled status on job cards.
```

---

**Stage 17 — Search & Filters Polish**
```
Complete Phase 1 Stage 17 from TODO.md. Ensure GET /api/jobs supports all driver-side filter query params (city, minPay, maxPay, jobType, carType, transmissionType, workingHours). Ensure GET /api/applications/job/:jobId supports customer-side filter params (minRating, experienceLevel). Polish the frontend filter bars for both driver job browsing and customer applicant viewing, with a clear filters option.
```

---

**Stage 18 — Responsive Design & Final Polish**
```
Complete Phase 1 Stage 18 from TODO.md. Do a full responsive pass across all pages at desktop (1280px+), tablet (768-1279px), and mobile (under 768px). Verify the mobile hamburger drawer, card hover animations, button transitions, FAQ accordion animation, scroll fade-ins via IntersectionObserver, and toast notifications all work. Add EmptyState components for all empty list cases, Skeleton loading states for job and applicant lists, and error boundary handling for failed API calls.
```

---

**Stage 19 — Deployment**
```
Complete Phase 1 Stage 19 from TODO.md. Set up MongoDB Atlas free M0 cluster and Cloudinary account, configure all environment variables. Deploy the backend to Render and the frontend to Vercel with VITE_API_URL pointing to the Render backend. Update CORS with the live Vercel URL. Run a full end-to-end smoke test: signup → login → profile setup → post job → apply → hire → accept → complete → rate.
```

---
---

## PHASE 2 — Version 1.0 (Production)

---

**Stage 1 — Real Authentication**
```
Complete Phase 2 Stage 1 from TODO.md. Replace the Phase 1 auth stubs: integrate Twilio or MSG91 for SMS OTP (send-otp and verify-otp routes), add email verification via SendGrid or Resend, implement refresh token rotation with httpOnly cookies, add session management (revoke on logout from all devices), and add a Login with OTP option to the Login page. Update AuthContext to use httpOnly cookies instead of localStorage.
```

---

**Stage 2 — Real Document Verification**
```
Complete Phase 2 Stage 2 from TODO.md. Replace the isVerified: true stub. Integrate DigiLocker API or IDfy/Karza for Aadhaar, PAN, and Driving License verification, and AuthBridge for background checks. Keep driver accounts inactive until all checks pass. Update Driver Onboarding Step 4 to show real verification status (pending → under review → verified / rejected with reason). Create admin notifications for manual review cases.
```

---

**Stage 3 — Admin Panel**
```
Complete Phase 2 Stage 3 from TODO.md. Mount the /api/admin router (all routes behind requireRole('admin'), which was already built in Phase 1). Build all backend admin routes: stats, verification-queue, approve/reject drivers, user management, job management, complaints. Build all frontend admin screens: /admin/dashboard, /admin/verification-queue, /admin/users, /admin/jobs, and /admin/complaints. Add admin routing with the role guard.
```

---

**Stage 4 — Real-Time Infrastructure (Socket.io)**
```
Complete Phase 2 Stage 4 from TODO.md. Install socket.io on the backend and socket.io-client on the frontend. Wrap the existing HTTP server with Socket.io in server.ts. Add Socket.io JWT auth middleware. Set up user and job rooms. Update notification.service.ts to emit Socket.io events alongside DB writes. Replace the Phase 1 NotificationContext 30s polling with Socket.io event listeners. Add live applicant count updates and live job feed for drivers.
```

---

**Stage 5 — Payments & Wallet (Razorpay)**
```
Complete Phase 2 Stage 5 from TODO.md. Integrate Razorpay: build create-order, verify webhook, and release-escrow routes. Implement driver wallet with balance, withdrawal, and bank account setup. Add platform fee/commission deduction logic. Build invoice PDF generation. Add an Earnings tab to the Driver Dashboard, a Payments tab to the Customer Dashboard, and the invoice screen with a download button. This activates the paymentId field in the jobs schema that was null in Phase 1.
```

---

**Stage 6 — GPS Tracking**
```
Complete Phase 2 Stage 6 from TODO.md. Integrate the Google Maps JavaScript API. Build Socket.io driver location broadcast scoped to job rooms. Build the customer-facing live GPS tracking screen with a full-width map, real-time driver marker, and job summary overlay. Add driver-side Geolocation API integration to send location updates during in_progress jobs. Add a tracking link to the Customer Dashboard for active jobs. This activates the location GeoJSON field in the jobs schema that was null in Phase 1.
```

---

**Stage 7 — In-App Chat**
```
Complete Phase 2 Stage 7 from TODO.md. Create the Message model. Build GET /api/chat/:jobId and POST /api/chat/:jobId routes scoped to job participants only. Add a Socket.io room per jobId for real-time message delivery. Build the chat screen UI with message bubbles (driver left, customer right), timestamps, and an input bar. Make it accessible from the active job card. Ensure strict no cross-job message leakage.
```

---

**Stage 8 — Push Notifications (FCM)**
```
Complete Phase 2 Stage 8 from TODO.md. Integrate Firebase Cloud Messaging: create fcm.service.ts, add fcmToken field to the users schema, trigger FCM push alongside the existing notification DB write and Socket.io emit. Add FCM token registration on login and a push notification opt-in banner on the frontend. Integrate SendGrid or Resend for email notifications on key events (job completed, payment released).
```

---

**Stage 9 — Advanced Geo-Matching**
```
Complete Phase 2 Stage 9 from TODO.md. Add a 2dsphere index on jobs.location. Integrate Google Maps Geocoding API to convert job address strings to GeoJSON on job creation. Update GET /api/jobs to use MongoDB $near/$geoWithin queries instead of city string matching. Store driver location as GeoJSON Point in driver_profiles. Add configurable proximity radius. Update the frontend job browse to show distance-based results. This fully activates the location field that was null in Phase 1.
```

---

**Stage 10 — Cancellation Penalties**
```
Complete Phase 2 Stage 10 from TODO.md. Replace the Phase 1 no-penalty stub. Define a configurable free cancellation window (e.g. 15 minutes after acceptance). Implement late cancellation penalty deduction from driver/customer wallet balance. Add admin UI to configure the window and penalty amounts. Update the cancellation modal on the frontend to display the policy and penalty warning.
```

---

**Stage 11 — AI Job Matching (Optional)**
```
Complete Phase 2 Stage 11 from TODO.md. Design and implement a job matching algorithm factoring in driver history, ratings, location proximity, vehicle skills, and availability. Build the backend recommendation endpoints. Add a Recommended for You section on the driver browse jobs tab and a Suggested Drivers section on the customer post-job confirmation screen.
```

---

**Stage 12 — Production Infrastructure**
```
Complete Phase 2 Stage 12 from TODO.md. Set up Upstash Redis for caching and rate limit counters. Add express-rate-limit with Redis store on all API endpoints. Integrate Sentry for frontend and backend error monitoring. Set up Logtail or Datadog for structured backend logs. Configure Cloudflare or Vercel Edge CDN for static assets. Set up PM2 cluster mode. Run a performance audit (DB query optimization, index review, N+1 queries), a security audit (OWASP Top 10, input sanitization, CSRF, secure headers via helmet), and a load test.
```
