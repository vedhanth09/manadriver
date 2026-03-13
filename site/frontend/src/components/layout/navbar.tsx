import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/shared/notification-bell"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import logo from "@/assets/logo.png"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "For Business", href: "/#business" },
  { label: "About Us", href: "/#about" },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const dashboardLink = user?.role === "driver" ? "/driver" : "/customer"

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="ManaDriver Logo" className="h-8 w-auto lg:h-10" />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <Link to={dashboardLink}>
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <NotificationBell />
              <span className="text-sm font-medium text-foreground">{user.fullName}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger — min 44px touch target */}
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile Drawer — full-screen slide-down */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white shadow-modal transition-all duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-1 border-b border-border p-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-accent"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <hr className="my-2 border-border" />
          {isAuthenticated && user ? (
            <>
              <Link
                to={dashboardLink}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-surface"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                }}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-left text-sm font-medium text-muted-foreground hover:bg-surface"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-surface"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
              >
                <Button variant="primary" className="mt-1 w-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export { Navbar }
