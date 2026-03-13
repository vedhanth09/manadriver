import { Link } from "react-router-dom"
import {
  Users,
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  Clock,
  Car,
  DollarSign,
  Lock,
  Headphones,
  UserCheck,
  Zap,
  Route,
  CalendarDays,
  Crown,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatCard } from "@/components/shared/stat-card"
import { Accordion } from "@/components/ui/accordion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn"

import heroIllustration from "@/assets/hero-illustration.png"
import indiaMap from "@/assets/india-map.png"
import phoneMockup from "@/assets/phone-mockup.png"

/* ──────────────────────────────────────────
   Section 1 — Hero
   ────────────────────────────────────────── */

function HeroSection() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-mint-bg pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div
        ref={ref}
        className="fade-in mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8"
      >
        {/* Text */}
        <div className="flex flex-col gap-6">
          <span className="text-caption font-semibold uppercase tracking-widest text-accent">
            India's Trusted Driver Platform
          </span>
          <h1 className="text-h1 font-bold leading-tight text-foreground">
            Hire a Verified Driver, Anytime
          </h1>
          <p className="max-w-lg text-body text-muted-foreground">
            Whether you need a driver for a few hours, a few days, or
            full-time — find trusted, verified professionals in minutes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                Book a Driver Now
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="ghost" size="lg">
                Become a Driver&nbsp;&rarr;
              </Button>
            </Link>
          </div>
        </div>

        {/* Illustration placeholder */}
        <div className="flex items-center justify-center">
          <div className="flex w-full items-center justify-center lg:h-80">
            <img src={heroIllustration} alt="Hero Illustration" className="max-h-full max-w-full drop-shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 2 — Trust & Statistics
   ────────────────────────────────────────── */

const stats = [
  { icon: <Users className="size-8" />, value: "10,000+", label: "Happy Customers" },
  { icon: <Star className="size-8" />, value: "4.8", label: "App Rating" },
  { icon: <Car className="size-8" />, value: "50,000+", label: "Trips Completed" },
  { icon: <MapPin className="size-8" />, value: "25+", label: "Cities Covered" },
]

function StatsSection() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-white py-16 lg:py-24">
      <div
        ref={ref}
        className="fade-in mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 lg:grid-cols-4 lg:px-8"
      >
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 3 — Why Choose Us
   ────────────────────────────────────────── */

const whyChooseUs = [
  {
    icon: <ShieldCheck className="size-10 text-accent" />,
    title: "Verified Drivers",
    description:
      "Every driver goes through background checks and document verification before they can accept jobs.",
  },
  {
    icon: <DollarSign className="size-10 text-accent" />,
    title: "Transparent Pricing",
    description:
      "No hidden charges. See the exact payout before you book — hourly, daily, or monthly.",
  },
  {
    icon: <Zap className="size-10 text-accent" />,
    title: "Fast Matching",
    description:
      "Post a job and start receiving driver applications within minutes. Hire in a few clicks.",
  },
  {
    icon: <Car className="size-10 text-accent" />,
    title: "Relax in Your Car",
    description:
      "Sit back and enjoy the ride. Our professionals handle the driving so you don't have to.",
  },
]

function WhyChooseUsSection() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-surface py-16 lg:py-24">
      <div ref={ref} className="fade-in mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center text-h2 font-bold text-foreground">
          Why Choose Us
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {whyChooseUs.map((item) => (
            <Card key={item.title} className="bg-white">
              <CardContent className="flex flex-col gap-4 p-8">
                {item.icon}
                <h3 className="text-h3 font-semibold text-foreground">{item.title}</h3>
                <p className="text-body text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 4 — Services
   ────────────────────────────────────────── */

const services = [
  {
    icon: <Zap className="size-10 text-accent" />,
    title: "Instant Booking",
    description: "Need a driver right now? Book one in under 60 seconds.",
  },
  {
    icon: <Route className="size-10 text-accent" />,
    title: "Outstation Trips",
    description: "Long-distance travel with experienced, reliable drivers.",
  },
  {
    icon: <CalendarDays className="size-10 text-accent" />,
    title: "Daily Commute",
    description: "Hire a regular driver for your daily office commute.",
  },
  {
    icon: <Crown className="size-10 text-accent" />,
    title: "Premium Drivers",
    description: "Top-rated drivers for luxury vehicles and VIP travel.",
  },
]

function ServicesSection() {
  const ref = useScrollFadeIn()
  return (
    <section id="services" className="bg-white py-16 lg:py-24">
      <div ref={ref} className="fade-in mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center text-h2 font-bold text-foreground">
          Our Services
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-card border border-border bg-white p-8 transition-all duration-150 hover:border-accent hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="mb-4">{s.icon}</div>
              <h3 className="mb-2 text-h3 font-semibold text-foreground">{s.title}</h3>
              <p className="text-body text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 5 — Safety
   ────────────────────────────────────────── */

const safetyFeatures = [
  {
    icon: <AlertTriangle className="size-10" />,
    title: "Emergency SOS",
    description: "One-tap emergency alert to local authorities and emergency contacts.",
  },
  {
    icon: <Lock className="size-10" />,
    title: "Private Numbers",
    description: "Your phone number is never shared. Communication goes through the platform.",
  },
  {
    icon: <Headphones className="size-10" />,
    title: "24x7 Support",
    description: "Round-the-clock support team ready to help whenever you need it.",
  },
  {
    icon: <UserCheck className="size-10" />,
    title: "Background Verified",
    description: "Every driver undergoes identity and criminal background verification.",
  },
]

function SafetySection() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-primary py-16 lg:py-24">
      <div ref={ref} className="fade-in mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center text-h2 font-bold text-white">
          Your Safety Comes First
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {safetyFeatures.map((f) => (
            <div key={f.title} className="flex flex-col gap-4 text-center">
              <div className="mx-auto text-accent">{f.icon}</div>
              <h3 className="text-h3 font-semibold text-white">{f.title}</h3>
              <p className="text-body text-white/70">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 6 — Service Areas
   ────────────────────────────────────────── */

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
]

function ServiceAreasSection() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-white py-16 lg:py-24">
      <div
        ref={ref}
        className="fade-in mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8"
      >
        {/* Map placeholder */}
        <div className="flex justify-center lg:h-80">
          <img src={indiaMap} alt="Service Areas Map" className="max-h-full" />
        </div>

        {/* Area list */}
        <div className="flex flex-col gap-6">
          <h2 className="text-h2 font-bold text-foreground">
            Available in Your City
          </h2>
          <p className="text-body text-muted-foreground">
            We're expanding fast. Find reliable drivers across India's top
            metro and tier-2 cities.
          </p>
          <div className="flex flex-wrap gap-3">
            {cities.map((city) => (
              <span
                key={city}
                className="rounded-badge bg-mint-bg px-4 py-1.5 text-sm font-medium text-accent"
              >
                {city}
              </span>
            ))}
          </div>
          <Link to="/signup">
            <Button variant="primary">Book Now in Your Area</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 7 — FAQ
   ────────────────────────────────────────── */

const faqItems = [
  {
    id: "faq-1",
    question: "How does the hiring process work?",
    answer:
      "Post a job with your requirements — location, vehicle type, and duration. Verified drivers in your area will apply. Review their profiles and ratings, then hire the best fit with a single click.",
  },
  {
    id: "faq-2",
    question: "Are all drivers verified?",
    answer:
      "Yes. Every driver on our platform undergoes Aadhaar, PAN, and driving license verification. We also perform background checks before activating any driver account.",
  },
  {
    id: "faq-3",
    question: "What types of jobs can I post?",
    answer:
      "We support three job types: Hourly (for short trips or errands), Temporary (multi-day engagements), and Permanent (full-time monthly drivers).",
  },
  {
    id: "faq-4",
    question: "How is pricing determined?",
    answer:
      "You set the payout when posting a job. Drivers see the offered amount before applying, ensuring full transparency. There are no hidden fees.",
  },
  {
    id: "faq-5",
    question: "Can I cancel after hiring a driver?",
    answer:
      "Yes, either party can cancel a job. Simply navigate to the active job in your dashboard and select Cancel. A reason field is provided for feedback.",
  },
  {
    id: "faq-6",
    question: "Which cities are supported?",
    answer:
      "We currently operate in 25+ cities across India including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, and more. We're expanding rapidly.",
  },
]

function FAQSection() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-white py-16 lg:py-24">
      <div ref={ref} className="fade-in mx-auto max-w-3xl px-4 lg:px-8">
        <h2 className="mb-12 text-center text-h2 font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <Accordion items={faqItems} />
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 8 — Driver Partner Banner
   ────────────────────────────────────────── */

function DriverPartnerBanner() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-mint-bg py-16 lg:py-24">
      <div
        ref={ref}
        className="fade-in mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center lg:px-8"
      >
        <Briefcase className="size-12 text-accent" />
        <h2 className="text-h2 font-bold text-foreground">
          Join as a Driver Partner
        </h2>
        <p className="max-w-lg text-body text-muted-foreground">
          Earn ₹25,000+ monthly. Set your own schedule, pick jobs you like,
          and grow your career with us.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="lg">
            Join Now&nbsp;&rarr;
          </Button>
        </Link>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 9 — Business Services Banner
   ────────────────────────────────────────── */

function BusinessBanner() {
  const ref = useScrollFadeIn()
  return (
    <section id="business" className="bg-card py-16 lg:py-24">
      <div
        ref={ref}
        className="fade-in mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center lg:px-8"
      >
        <Clock className="size-12 text-accent" />
        <h2 className="text-h2 font-bold text-foreground">
          Need On-Demand Drivers for Your Business?
        </h2>
        <p className="max-w-lg text-body text-muted-foreground">
          Fleet management, corporate travel, and dedicated driver pools —
          tailored for businesses of every size.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="lg">
            Learn More&nbsp;&rarr;
          </Button>
        </Link>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Section 10 — App Download
   ────────────────────────────────────────── */

function AppDownloadSection() {
  const ref = useScrollFadeIn()
  return (
    <section className="bg-white py-16 lg:py-24">
      <div
        ref={ref}
        className="fade-in mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8"
      >
        {/* Phone mockup placeholder */}
        <div className="flex justify-center lg:h-96">
          <img src={phoneMockup} alt="ManaDriver App Mockup" className="max-h-full drop-shadow-2xl" />
        </div>

        {/* Copy + store buttons */}
        <div className="flex flex-col gap-6">
          <h2 className="text-h2 font-bold text-foreground">
            Get the ManaDriver App
          </h2>
          <p className="max-w-lg text-body text-muted-foreground">
            Book drivers, track rides, and manage everything on the go.
            Download the app for the best experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-flex h-12 items-center gap-2 rounded-button bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                <path d="M3.609 1.814 13.792 12 3.61 22.186a2.372 2.372 0 0 1-.106-.721V2.535c0-.25.036-.491.105-.721Zm.848-.676L15.197 7.7l-2.768 2.767L4.457 1.138Zm11.451 5.14L17.95 7.56c.58.336.98.714.98 1.177 0 .463-.4.84-.98 1.177l-2.264 1.308L12.86 8.4l3.047-2.123ZM4.457 22.862l7.972-9.329 2.768 2.767L4.457 22.862Z" />
              </svg>
              Google Play
            </a>
            <a
              href="#"
              className="inline-flex h-12 items-center gap-2 rounded-button bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
              </svg>
              App Store
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────
   Landing Page Composition
   ────────────────────────────────────────── */

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <WhyChooseUsSection />
        <ServicesSection />
        <SafetySection />
        <ServiceAreasSection />
        <FAQSection />
        <DriverPartnerBanner />
        <BusinessBanner />
        <AppDownloadSection />
      </main>
      <Footer />
    </div>
  )
}

export { LandingPage }
