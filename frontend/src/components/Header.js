import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const authed = user && typeof user === "object";

  const navLinks = authed
    ? [
        { to: "/app", label: "Home" },
        { to: "/counsel", label: "Counsel" },
        { to: "/diary", label: "Diary" },
        { to: "/stories", label: "Stories of Freedom" },
        { to: "/donate", label: "Donate" },
        { to: "/pay-it-forward", label: "Give This Gift" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/stories", label: "Stories of Freedom" },
        { to: "/donate", label: "Donate" },
        { to: "/gift", label: "Give a Gift" },
      ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-wwjd-line">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to={authed ? "/app" : "/"} data-testid="header-home-link" className="flex items-center gap-2">
          <span className="font-serif-display text-xl tracking-wide text-wwjd-text">W.W.J.D.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-sm transition-colors hover:text-wwjd-terracotta ${
                location.pathname === l.to ? "text-wwjd-terracotta" : "text-wwjd-soft"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {authed ? (
            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              className="text-sm text-wwjd-muted hover:text-wwjd-text transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              data-testid="header-login-link"
              className="text-sm text-wwjd-muted hover:text-wwjd-text transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>

        <button
          className="md:hidden text-wwjd-soft"
          onClick={() => setOpen((o) => !o)}
          data-testid="mobile-menu-toggle"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-wwjd-line bg-white/95 backdrop-blur-md px-5 py-4 flex flex-col gap-4 animate-fade">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              data-testid={`mobile-nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-base text-wwjd-soft"
            >
              {l.label}
            </Link>
          ))}
          {authed ? (
            <button onClick={handleLogout} className="text-left text-base text-wwjd-muted" data-testid="mobile-logout-btn">
              Sign out
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-base text-wwjd-muted" data-testid="mobile-login-link">
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
