# Product Requirements Document (PRD)
# Driver Hiring & Management Platform

> **For AI Coding Agent:** This document defines what to build and why. Features are split into two phases. Phase 1 is a functional validation prototype — no real integrations, no production-grade security. Phase 2 builds directly on top of Phase 1 code with zero throwaway work.

---

## Project Overview

A two-sided marketplace connecting **Drivers** (seeking driving jobs) with **Customers** (hiring drivers). Customers post jobs (hourly, temporary, or permanent). Drivers browse, filter, and apply. Customers review applicants and hire.

**Three user roles:**
- `driver` — applies to jobs
- `customer` — posts jobs, selects drivers
- `admin` — manages platform (Phase 2)

---

## PHASE 1 — Validation Prototype

> Goal: Let a real person experience the full hiring flow end-to-end. Validate the concept before investing in integrations.
> Scope: Core flows only. Mock/stub all third-party services. No real payments, no real document verification, no SMS.

---

### P1.1 — User Registration & Login

**Driver Registration:**
- Full Name, Email, Phone, Password, Role = "Driver"
- After signup → redirect to Driver Profile Setup

**Customer Registration:**
- Full Name, Email, Phone, Password, Role = "Customer"
- After signup → redirect to Customer Dashboard

**Login:**
- Email + Password
- JWT-based session (stored in `localStorage` for Phase 1)
- Role-based redirect after login

> **Phase 1 Stub:** No email verification. No OTP/SMS. Passwords hashed with bcrypt.

---

### P1.2 — Driver Profile Setup

**Required fields:**
- Full Name, Phone, Email, Age, Address, City, Areas (multi-select within city)

**Vehicle Skills:**
- Transmission type: Manual / Automatic / Semi-Automatic (checkbox, multi-select)

**Vehicle Category Experience:**
- Hatchback / Sedan / SUV / Luxury (checkbox, multi-select)

**Document Uploads (Phase 1 — UI only):**
- Aadhaar Card upload field
- PAN Card upload field
- Driving License upload field

> **Phase 1 Stub:** Documents are uploaded and stored (Cloudinary), but verification is manual/skipped. Driver account is activated immediately after profile completion. No background check API.

---

### P1.3 — Customer Profile Setup

**Required fields:**
- Name, Phone, Email, Location/City

**Optional fields:**
- Car details (make/model)
- Driver preferences (transmission type, vehicle category)

---

### P1.4 — Job Posting System

Customers create jobs. Three job types:

**Hourly Job:**
- Start Location, End Location, Estimated Duration (hours), Car Type, Transmission Type, Expected Payout (₹)

**Temporary Job (Day/Multi-day):**
- Start Location, End Location, Duration (days), Car Type, Transmission Type, Daily Payment (₹)

**Permanent Job (Monthly):**
- Work Location, Car Type, Transmission Type, Working Hours (12hr / 24x7), Monthly Salary (₹)

All jobs are saved with `status: "posted"` and become visible in the Job Marketplace.

---

### P1.5 — Job Marketplace (Driver View)

- Drivers see all posted jobs in their selected city/areas
- Each job card shows: Location, Job Type, Car Type, Transmission, Duration, Payout, Customer Rating (placeholder 0 if no history)
- Drivers can **Apply** or **Skip** each job
- Drivers can filter by: Location, Pay range, Job Type, Car Type, Working Hours

---

### P1.6 — Driver Application System

- A driver can apply to multiple open jobs
- Once a customer selects this driver for a job, all other pending applications for that driver are auto-closed
- Driver can see application status: `Pending / Approved / Rejected`

---

### P1.7 — Customer — Driver Selection Flow

- Customer sees all drivers who applied to their job
- Each applicant card shows: Name, Age, Rating, Pay Expectation, Vehicle Experience, Verification Status
- **Ranking rule:** First-applied shown first; ties broken by higher rating
- Customer clicks **Hire** → job assigned, all other applicants notified (status = `rejected`)

---

### P1.8 — Job Acceptance by Driver

After customer hires:
- Driver receives: Customer Name, Phone Number, Pickup Location, Job Details
- Driver can **Accept** or **Decline**
- If declined → customer is notified; customer can pick another applicant

---

### P1.9 — Job Status Lifecycle

```
posted → applied → accepted → in_progress → completed
                 ↘ cancelled
```

- `posted` — job created by customer
- `applied` — at least one driver has applied
- `accepted` — customer has selected a driver, driver accepted
- `in_progress` — job is live (manually triggered by driver or customer)
- `completed` — manually marked complete by either party
- `cancelled` — cancelled by driver or customer

---

### P1.10 — Driver Dashboard

Tabs:
- **Browse Jobs** — job marketplace
- **My Applications** — pending / approved / rejected
- **Active Jobs** — currently in progress
- **Completed Jobs** — history

---

### P1.11 — Customer Dashboard

Tabs:
- **Post a Job** — job creation form
- **My Jobs** — active job listings + applicants
- **Completed Jobs** — history with rating prompts

---

### P1.12 — Rating & Review (Post-Completion)

- After `completed`, customer is prompted to rate the driver
- Rating: 1–5 stars across: Driving Skill, Professional Behavior, Punctuality
- Optional text review
- Driver's average rating auto-updates
- Driver can also rate the customer (1–5 stars, optional)

> **Phase 1:** Ratings stored and shown in profiles. No gamification, no moderation.

---

### P1.13 — Notifications (In-App Only)

- Notification bell in nav bar with unread count
- Stored in DB and fetched on load (no real-time in Phase 1)

**Driver notifications:** New job in area, application approved/rejected
**Customer notifications:** New driver applied, driver accepted/declined job

> **Phase 1 Stub:** Polling-based (no WebSockets). No push notifications. No email/SMS.

---

### P1.14 — Cancellation

- Either party can cancel an `accepted` or `in_progress` job
- Cancellation reason field (optional free text)
- No financial penalty logic in Phase 1

---

### P1.15 — Search & Filters

**Driver-side job filters:** Location, Minimum Pay, Job Type, Car Type, Transmission
**Customer-side applicant filters:** Rating (min), Experience level, Availability

---

### ❌ Explicitly OUT of Phase 1

| Feature | Reason Deferred |
|---|---|
| Real document verification API (DigiLocker, etc.) | Needs paid integration |
| SMS / OTP login | Needs Twilio/SMS gateway |
| Real-time WebSocket notifications | Phase 2 |
| Payment / wallet / invoicing | Phase 2 |
| GPS tracking | Phase 2 |
| In-app chat | Phase 2 |
| Admin panel | Phase 2 |
| AI job matching | Phase 2 |
| Multi-city scaling / geo-queries | Phase 2 |
| Insurance / training modules | Phase 2 |

---

---

## PHASE 2 — Version 1.0 (Production)

> Goal: Launch to real users. Every feature below is additive — Phase 1 code stays intact.
> All Phase 1 stubs/mocks are replaced with real integrations.

---

### P2.1 — Real Authentication

- OTP-based phone verification via **Twilio** or **MSG91**
- Email verification on signup
- Refresh token rotation
- Session management (revoke on logout from all devices)

---

### P2.2 — Real Document Verification

- Integrate **DigiLocker API** or **Karza / IDfy** for:
  - Aadhaar verification
  - PAN verification
  - Driving License validation
- Background check via **AuthBridge** or similar
- Driver account stays `inactive` until all checks pass
- Admin dashboard shows verification queue

---

### P2.3 — Admin Panel

**Admin capabilities:**
- View and manage all users (drivers + customers)
- Manual document review & approval/rejection
- Job monitoring (flag suspicious postings)
- Complaint & dispute handling
- Platform analytics: DAU, jobs posted, completion rate, avg rating

---

### P2.4 — Real-Time Features (WebSocket via Socket.io)

- Live job feed updates (new jobs appear without page refresh)
- Instant notifications (replace polling)
- Real-time application count on job cards
- Live status updates when driver accepts/declines

---

### P2.5 — Payment & Wallet

- Escrow-style payment flow: customer pays upfront, released on job completion
- Integrate **Razorpay** or **Stripe India**
- Driver wallet: withdrawal to bank account
- Platform fee / commission deduction
- Invoice generation (PDF) for completed jobs

---

### P2.6 — GPS Tracking

- Live driver location during `in_progress` jobs
- Uses **Google Maps + Socket.io** to broadcast driver coords
- Customer can track driver on a map

---

### P2.7 — In-App Chat

- Driver ↔ Customer messaging per job
- Message history stored per job
- No cross-job message leakage

---

### P2.8 — Push Notifications

- **Firebase Cloud Messaging (FCM)** for mobile web / PWA
- Email notifications via **SendGrid** or **Resend** for key events

---

### P2.9 — Advanced Geo-Matching

- Replace city-string matching with MongoDB geo-queries (`$near`, `$geoWithin`)
- Drivers store location as GeoJSON Point
- Job matching within configurable radius

---

### P2.10 — Cancellation Penalties

- Define cancellation window (e.g., free cancel within 15 min)
- Late cancellation deducts from driver/customer wallet balance
- Policy configurable by Admin

---

### P2.11 — AI Job Matching (Optional / Post-launch)

- Recommend best-fit jobs to drivers based on history, ratings, location
- Recommend best-fit drivers to customers when posting a job

---

### P2.12 — Scalability & Infrastructure

- Add Redis for caching job listings and session tokens
- Rate limiting on all API endpoints
- CDN for static assets
- Horizontal scaling on backend (PM2 cluster or containerized)
- Monitoring: **Sentry** (errors) + **Datadog** or **Logtail** (logs)

---

## Transition: Phase 1 → Phase 2

No feature needs to be rebuilt. The upgrade path is:

| Phase 1 (stub) | Phase 2 (replace with) |
|---|---|
| `isVerified: true` on signup | Hook into verification API response |
| Polling for notifications | Drop-in Socket.io events |
| No payment field | Add `payment` object to Job schema |
| String-based city matching | Add `location: GeoJSON` field to schema |
| In-app notifications only | Add FCM token field to User schema |
| No admin routes | Mount `/admin` router (already role-guarded) |
