import { Link } from "react-router-dom"

const footerSections = [
  {
    title: "About",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Instant Booking", href: "#" },
      { label: "Outstation Trips", href: "#" },
      { label: "Daily Commute", href: "#" },
      { label: "Premium Drivers", href: "#" },
    ],
  },
  {
    title: "For Business",
    links: [
      { label: "Corporate Plans", href: "#" },
      { label: "Fleet Management", href: "#" },
      { label: "API Access", href: "#" },
    ],
  },
  {
    title: "Cities",
    links: [
      { label: "Mumbai", href: "#" },
      { label: "Delhi", href: "#" },
      { label: "Bangalore", href: "#" },
      { label: "Hyderabad", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Support", href: "#" },
      { label: "Partnerships", href: "#" },
    ],
  },
]

function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} ManaDriver. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-white/50 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
