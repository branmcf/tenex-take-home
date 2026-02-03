import { useMemo, useState } from "react";
import ArrowIcon from "./ArrowIcon";

const HERO_VIDEO_SRC = "https://pub-26ea6282fa24439493c91bf324dd1256.r2.dev/1.5.mp4";

export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { label: "Platform", href: "#platform" },
      { label: "Execution", href: "#execution" },
      { label: "Security", href: "#security" },
      { label: "Pricing", href: "#access" },
    ],
    []
  );

  return (
    <section className="section-dark">
      <div className="nav_component">
        <div className="nav-container">
          <div className="nav-left">
            <a className="nav-brand" href="#">
              <span className="nav-logo">TX</span>
              <span>Tenex</span>
            </a>

            <div className="hidden md:block">
              <div className="nav-menu-wrapper">
                <div className="dropdown">
                  <button type="button" className="nav-link nav-link-trigger">
                    <span>Product</span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 4l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <span className="subhead-square" />
                      <span className="label-mono">Products</span>
                    </div>
                    <div className="nav-dropdown-items">
                      <a className="nav-dropdown-item" href="#platform">
                        <span className="green-square" />
                        <span>Search and Chat</span>
                      </a>
                      <a className="nav-dropdown-item" href="#stack">
                        <span className="green-square" />
                        <span>Deterministic Workflows</span>
                      </a>
                    </div>
                  </div>
                </div>

                {navLinks.map((l) => (
                  <a key={l.href} className="nav-link" href={l.href}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden items-center md:flex">
            <div className="button-group">
              <a
                className="button"
                data-text-color="dark gray"
                data-border-color="dark gray"
                data-arrow-color="dark gray"
                href="https://bplex.branmcf.com"
              >
                <div className="button-text">Log in</div>
              </a>
              <a
                className="button"
                data-text-color="green 1"
                data-border-color="green 1"
                data-arrow-color="green 1"
                href="#access"
              >
                <div className="button-text">Request Access</div>
                <span className="button-arrow">
                  <ArrowIcon />
                </span>
              </a>
            </div>
          </div>

          <button
            type="button"
            className="menu-button md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M4 4L14 14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M3 5H15" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 9H15" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 13H15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen ? (
          <div className="mobile-menu md:hidden">
            <a href="#platform" onClick={() => setMobileOpen(false)}>
              Platform
            </a>
            <a href="#execution" onClick={() => setMobileOpen(false)}>
              Execution
            </a>
            <a href="#security" onClick={() => setMobileOpen(false)}>
              Security
            </a>
            <a href="#access" onClick={() => setMobileOpen(false)}>
              Access
            </a>
            <div className="pt-4">
              <div className="button-group">
                <a
                  className="button"
                  data-text-color="dark gray"
                  data-border-color="dark gray"
                  data-arrow-color="dark gray"
                  href="https://bplex.branmcf.com"
                >
                  <div className="button-text">Log in</div>
                </a>
                <a
                  className="button"
                  data-text-color="green 1"
                  data-border-color="green 1"
                  data-arrow-color="green 1"
                  href="#access"
                >
                  <div className="button-text">Request Access</div>
                  <span className="button-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="hero-section">
        <div className="hero-grid-overlay blueprint-grid" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="pb-16 pt-20 animate-fade-in">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="subhead reveal">
                <span className="subhead-square" />
                <span>Deterministic Workflow Chat</span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl reveal reveal-delay-1">
                The Engine for Deterministic Work
              </h1>

              <p className="mt-6 max-w-[72ch] text-sm leading-relaxed text-muted-foreground sm:text-base reveal reveal-delay-2">
                Tenex pairs cited web answers with deterministic workflow runs inside the same thread. Use chat for speed. Turn on workflow mode for repeatable execution, reviewable steps, and clean handoffs.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 reveal reveal-delay-3">
                <a
                  className="button"
                  data-text-color="green 1"
                  data-border-color="green 1"
                  data-arrow-color="green 1"
                  href="#access"
                >
                  <div className="button-text">Request access</div>
                  <span className="button-arrow">
                    <ArrowIcon />
                  </span>
                </a>
                <a
                  className="button"
                  data-text-color="dark gray"
                  data-border-color="dark gray"
                  data-arrow-color="dark gray"
                  href="#platform"
                >
                  <div className="button-text">View platform</div>
                </a>
              </div>
            </div>

            <div className="mt-12">
              <div className="overflow-hidden rounded-[8px] border border-border bg-card">
                <div className="relative aspect-[16/9]">
                  <video
                    src={HERO_VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
