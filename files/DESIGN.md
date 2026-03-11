# Design Document
# Driver Hiring & Management Platform

> **For AI Coding Agent:** This document defines visual design, UI components, and page-level layouts. Phase 1 builds the full public-facing marketing site + all functional app screens. Phase 2 adds screens for features deferred to production (admin panel, GPS map, chat, payments). All design tokens, components, and layout patterns defined in Phase 1 carry forward — nothing is redesigned in Phase 2.

---

## Design System (Applies to Both Phases)

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#083344` | Nav, headings, primary dark elements |
| `--color-accent` | `#10B981` | CTA buttons, links, highlights |
| `--color-accent-hover` | `#059669` | Button hover state |
| `--color-mint-bg` | `#ECFDF5` | Hero background, feature section bg |
| `--color-white` | `#FFFFFF` | Page background |
| `--color-surface` | `#F8FAFC` | Light section backgrounds |
| `--color-card` | `#F1F5F9` | Card backgrounds |
| `--color-border` | `#E5E7EB` | Dividers, input borders |
| `--color-text-primary` | `#111827` | Body headings |
| `--color-text-secondary` | `#6B7280` | Subtext, captions |
| `--color-text-sub-heading` | `#374151` | Section subheadings |

### Typography

- **Font family:** Inter (or system sans-serif fallback)
- **H1:** 48px / Bold / `#111827`
- **H2:** 32px / Bold / `#111827`
- **H3:** 22px / SemiBold / `#374151`
- **Body:** 16px / Regular / `#6B7280`
- **Label/Caption:** 13px / Medium / `#6B7280`
- **Links:** `#10B981`, underline on hover

### Spacing Scale

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px (multiples of 4)

### Border Radius

- Cards: `12px`
- Buttons: `8px`
- Inputs: `8px`
- Badges: `9999px` (pill)

### Shadows

- Card default: `0 1px 3px rgba(0,0,0,0.08)`
- Card hover: `0 4px 16px rgba(0,0,0,0.12)` + `translateY(-2px)`
- Modal: `0 8px 32px rgba(0,0,0,0.16)`

### Reusable UI Components (build once, use everywhere)

- `<Navbar />`
- `<Button variant="primary|secondary|ghost" />`
- `<Card />` with hover lift
- `<Badge status="pending|approved|rejected|active|completed" />`
- `<Input />`, `<Select />`, `<Textarea />`
- `<Modal />`
- `<Accordion />` (FAQ)
- `<StatCard />` (icon + number + label)
- `<JobCard />` (driver-facing job listing item)
- `<ApplicantCard />` (customer-facing driver applicant)
- `<NotificationBell />` with unread count
- `<Avatar />` with fallback initials
- `<RatingStars />` (display + interactive)
- `<Tabs />` for dashboard navigation
- `<EmptyState />` with illustration + CTA
- `<Loader />` / `<Skeleton />`
- `<Toast />` notification system
- `<Footer />`

---

---

## PHASE 1 — Validation Prototype

### Screens to Build

---

#### 1. Public Marketing Site (Landing Page)

Single-page scrollable site. Acts as the front door — explains the product and drives signups.

---

**1.1 Navigation Bar**

- Fixed top, white bg, `1px solid #E5E7EB` bottom border
- Left: Logo (dark teal wordmark)
- Center: Links — Home / Services / For Business / About Us
- Right: `Login` (ghost button) + `Sign Up` (accent green button)
- Mobile: Hamburger menu → full-screen slide-down drawer

---

**1.2 Hero Section**

- Background: `#ECFDF5` (soft mint)
- Two-column layout (text left, visual right)
- Left:
  - Eyebrow text: "India's Trusted Driver Platform"
  - H1: Large bold headline (e.g., "Hire a Verified Driver, Anytime")
  - Subtext: 2-line description
  - Primary CTA: `Book a Driver Now` (accent green, large)
  - Secondary CTA: `Become a Driver →` (ghost/link style)
- Right: Driver illustration or hero image
- Mobile: Stack vertically, image moves below text

---

**1.3 Trust & Statistics Section**

- White background, centered layout
- 4 stat cards in a row (2×2 on mobile):
  - Happy Customers / App Rating / Trips Completed / Cities Covered
- Each card: large bold number + icon + label
- Use `#ECFDF5` card background

---

**1.4 Why Choose Us Section**

- Background: `#F8FAFC`
- Section heading + 4 feature cards in a 2×2 grid
- Each card: Illustration/icon + bold title + short description
- Features: Verified Drivers / Transparent Pricing / Fast Matching / Relax in Your Car
- Cards with soft shadow + hover lift

---

**1.5 Services Section**

- White background
- Grid of 4 service cards: Instant Booking / Outstation Trips / Daily Commute / Premium Drivers
- Each card: icon + title + 1-line description + subtle hover border highlight in accent green

---

**1.6 Safety Section**

- Background: `#083344` (dark teal) — full-width dark band
- Text in white
- 4 safety feature cards: Emergency SOS / Private Numbers / 24x7 Support / Background Verified
- Icons in accent green

---

**1.7 Service Areas Section**

- Two-column: Left = map illustration, Right = city/area list
- Area tags rendered as green pills
- CTA button: `Book Now in Your Area`

---

**1.8 FAQ Section**

- White background
- Accordion component — click to expand/collapse answer
- Smooth animation (max-height transition)
- 5–6 questions about how platform works

---

**1.9 Driver Partner Banner**

- Background: `#ECFDF5`
- "Join as a Driver Partner" headline
- "Earn ₹25,000+ monthly" supporting text
- `Join Now →` CTA button

---

**1.10 Business Services Banner**

- Background: `#F1F5F9`
- "Need on-demand drivers for your business?"
- `Learn More →` CTA

---

**1.11 App Download Section**

- Two-column: Left = phone mockup image, Right = description + store buttons
- Google Play button + Apple App Store button (Phase 1: buttons link to `#`, no live app yet)

---

**1.12 Footer**

- Dark background (`#083344`), white text
- 5 columns: About / Services / For Business / Cities / Contact
- Bottom row: Copyright + Privacy Policy + Terms of Service links

---

#### 2. Authentication Screens

**2.1 Signup Page**
- Role selection: Driver / Customer (toggle cards, not dropdown)
- Fields: Full Name, Email, Phone, Password, Confirm Password
- `Create Account` button
- Link: "Already have an account? Login"

**2.2 Login Page**
- Email + Password fields
- `Login` button
- Link: "Don't have an account? Sign up"
- "Forgot password?" link (Phase 1: non-functional, Phase 2: hooks up)

---

#### 3. Driver Onboarding Flow (Multi-Step)

**Step 1 — Personal Info**
- Full Name, Age, Phone, Email, Address

**Step 2 — Location**
- Select City (dropdown)
- Select Areas within city (multi-select chip selector)

**Step 3 — Vehicle Skills**
- Transmission: Manual / Automatic / Semi-Automatic (toggle chips)
- Vehicle Categories: Hatchback / Sedan / SUV / Luxury (toggle chips)

**Step 4 — Document Upload**
- Three upload boxes: Aadhaar, PAN, Driving License
- Each box: drag-and-drop or click-to-browse, shows filename on upload
- Upload status: idle → uploading → uploaded ✓
- `Submit for Verification` button

**Progress indicator:** Step 1 of 4 bar at top

---

#### 4. Customer Profile Setup

- Single page form: Name, Phone, Email, City
- Optional: Car Make/Model, Preferred Transmission
- `Save Profile` button → redirect to dashboard

---

#### 5. Customer Dashboard

**Top navigation tabs:** Post a Job / My Jobs / Completed

**Post a Job tab:**
- Job type selector: Hourly / Temporary / Permanent (card toggle)
- Dynamic form fields based on selection (see PRD P1.4)
- `Post Job` CTA

**My Jobs tab:**
- List of active job cards
- Each card: Job Type badge, Location, Payout, `X applicants` count, `View Applicants` button
- Click `View Applicants` → opens applicant list panel/modal

**Applicant List:**
- Each applicant card: Avatar, Name, Age, Rating (stars), Experience tags, `Hire` button
- Sorted: first-applied first, ties by rating

**Completed tab:**
- Past jobs with rating prompt if not yet rated
- `Rate Driver` button → opens rating modal

---

#### 6. Driver Dashboard

**Top navigation tabs:** Browse Jobs / My Applications / Active / Completed

**Browse Jobs tab:**
- Filter bar: Location / Job Type / Pay / Car Type
- Grid of Job Cards
- Each job card: Job Type badge, Location, Car Type, Transmission, Duration, Payout, Customer Rating, `Apply` button
- Applied jobs show `Applied ✓` badge (button disabled)

**My Applications tab:**
- List with status badges: `Pending` / `Approved` / `Rejected`
- Approved cards show: Customer Name, Phone, Pickup Location, Job Details + `Accept Job` / `Decline` buttons

**Active tab:**
- Current in-progress job details
- `Mark as Completed` button

**Completed tab:**
- Job history with customer rating received

---

#### 7. Notifications Panel

- Bell icon in nav with red badge count
- Click → slide-in side panel (or dropdown)
- Each notification: icon + text + timestamp
- `Mark all as read` button
- Empty state: "No new notifications"

---

#### 8. Rating Modal

- Triggered post-job-completion
- 3 rating categories (stars): Driving Skill / Professional Behavior / Punctuality
- Optional text review field
- `Submit Rating` button

---

### Responsive Behavior (Phase 1)

| Breakpoint | Layout |
|---|---|
| Desktop ≥1280px | Full multi-column, side-by-side cards |
| Tablet 768–1279px | 2-column grids, reduced padding |
| Mobile <768px | Single column, stacked sections, hamburger nav, larger touch targets (min 44px) |

---

### Interactions & Animations (Phase 1)

- Card hover: `translateY(-2px)` + shadow deepen
- Button hover: `background-color` transition 150ms ease
- FAQ accordion: `max-height` transition 300ms ease
- Scroll fade-in: `opacity 0→1 + translateY 20px→0` on viewport enter (IntersectionObserver)
- Tab switch: instant, no animation needed
- Toast notifications: slide in from top-right, auto-dismiss after 3s

---

---

## PHASE 2 — Version 1.0 (Production)

> All Phase 1 screens remain. Phase 2 adds the following new screens and updates existing ones. No redesign — same design system.

---

### New Screens

**Admin Panel** (`/admin/*`)
- `/admin/dashboard` — platform stats: DAU, jobs, completion rate, avg rating
- `/admin/verification-queue` — pending driver document reviews; `Approve` / `Reject` with notes
- `/admin/users` — searchable table of all users with filter by role/status
- `/admin/jobs` — all jobs with status filters, ability to flag/remove
- `/admin/complaints` — complaint tickets with resolution workflow

**Live GPS Tracking Screen** (Customer view during `in_progress`)
- Full-width Google Map
- Driver location marker updates via WebSocket
- Job summary panel overlay

**In-App Chat Screen**
- Per-job chat thread (accessible from active job card)
- Message bubbles: driver (left) / customer (right)
- Timestamp per message
- Input bar + send button

**Payment / Wallet Screen**
- Customer: add funds, view transaction history, release payment on completion
- Driver: wallet balance, withdrawal button, bank account setup, transaction history

**Invoice Screen** (post-completion)
- PDF-renderable invoice layout
- Job details, hours, payout, platform fee breakdown
- Download button

---

### Updates to Existing Screens

- **Driver Dashboard:** Add `Earnings` tab (wallet balance + transaction history)
- **Customer Dashboard:** Add `Payments` tab + live tracking link for in-progress jobs
- **Job Card:** Add real-time applicant count (WebSocket-powered)
- **Notifications:** Upgrade from polling to WebSocket push; add push notification opt-in banner
- **Login:** Add "Login with OTP" option alongside email/password
- **Driver Onboarding — Step 4:** Show real verification status (pending / under review / verified / rejected with reason)
