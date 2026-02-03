function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M13 2L3 14h8l-1 8 11-14h-8l0-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const stats = [
  { icon: true, text: "ACTIVE AGENT SESSIONS: 180" },
  { icon: true, text: "AVG DISPATCH LATENCY: 90ms" },
  { icon: false, text: "SYSTEM STATUS: 100% OPERATIONAL", highlight: true },
  { icon: false, text: "DOCUMENTS PARSED: 500,922,040", highlight: true },
];

export default function HeroStats() {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 border border-border px-4 py-3"
            >
              {item.icon ? <BoltIcon className="h-4 w-4 text-foreground" /> : null}
              <div className={item.highlight ? "green-highlight-text" : undefined}>
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
