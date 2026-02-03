const columns = [
  {
    title: "Company",
    links: [
      { label: "Blog", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#access" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Platform", href: "#platform" },
      { label: "Use Cases", href: "#execution" },
      { label: "Access", href: "#access" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Docs", href: "#" },
      { label: "Status", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

function FooterLines() {
  return (
    <div className="footer-loop-wrapper" aria-hidden="true">
      <div className="footer-loop-row">
        {Array.from({ length: 2 }).map((_, blockIdx) => (
          <svg
            key={blockIdx}
            width="1600"
            height="72"
            viewBox="0 0 1600 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-[72px] w-auto"
          >
            {Array.from({ length: 80 }).map((__, i) => (
              <path
                key={i}
                d={`M${i * 20} 36 H${i * 20 + 14}`}
                stroke="rgba(130,195,140,0.9)"
                strokeWidth="2"
                opacity="0.25"
              />
            ))}
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="section-dark">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="space-y-6">
          <div className="subhead">
            <span className="subhead-square" />
            <span>Deterministic workflow chat</span>
          </div>
          <h2 className="text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            Ship reliable work faster with Tenex.
          </h2>
        </div>
      </div>

      <div className="mt-12 border-t border-border" />

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {col.title}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="block transition-colors duration-200 ease-out hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10 text-xs text-muted-foreground">
          <div className="green-highlight-text">
            [ TENEX INC. ] HQ: SF / TEAM: GLOBAL_
          </div>
        </div>
      </div>

      <FooterLines />
    </footer>
  );
}

