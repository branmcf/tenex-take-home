type UseCase = {
  title: string;
  detail: string;
};

const useCases: UseCase[] = [
  {
    title: "RESEARCH BRIEFS",
    detail:
      "Collect sources, synthesize, and publish a clean brief with citations and a run you can replay.",
  },
  {
    title: "CUSTOMER INSIGHTS",
    detail:
      "Scan reviews and tickets, tag themes, and ship a weekly summary that runs the same way every time.",
  },
  {
    title: "OPS RUNBOOKS",
    detail:
      "Kick off deterministic workflows for incidents, compliance checks, and repeatable internal processes.",
  },
];

function TileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8H17" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M7 12H15" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M7 16H13" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

export default function FeatureGrid() {
  return (
    <section id="execution" className="section-light section-grid">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4">
          <div className="subhead reveal">
            <span className="subhead-square" />
            <span>Use Cases</span>
          </div>
          <h2 className="text-3xl font-semibold text-balance reveal reveal-delay-1">
            Deploy repeatable work inside the conversation.
          </h2>
          <p className="max-w-[70ch] text-sm leading-relaxed text-muted-foreground reveal reveal-delay-2">
            Tenex is built for outcomes. Search and chat get you to an answer fast. Workflows turn the answer into something you can run again tomorrow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {useCases.map((u) => (
            <div key={u.title} className="panel p-6 hover-lift">
              <div className="flex items-start justify-between gap-6">
                <TileIcon />
                <span className="subhead-square" />
              </div>
              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  {u.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {u.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
