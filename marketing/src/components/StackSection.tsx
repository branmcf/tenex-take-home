const itemsLeft = [
  {
    title: "SEARCH AND CHAT",
    detail:
      "Fast answers with sources. Keep context, keep artifacts, and keep moving without losing the thread.",
  },
  {
    title: "WORKFLOW MODE",
    detail:
      "Switch into deterministic execution when you need guarantees. Steps and tools stay explicit and reviewable.",
  },
];

const itemsRight = [
  {
    title: "AUDITABLE HISTORY",
    detail:
      "Every run produces a readable timeline so teams can review what happened and rerun with confidence.",
  },
  {
    title: "TEAM HANDOFFS",
    detail:
      "Share a run instead of rewriting context. Anyone can pick up where it left off and ship the output.",
  },
];

function CenterVisual() {
  return (
    <div className="border border-border bg-white p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="subhead-square" />
          <span className="label-mono">tenex runtime</span>
        </div>
        <span className="label-mono">v1</span>
      </div>
      <div className="mt-6 aspect-[4/3] border border-border p-4 text-[10px] text-muted-foreground">
        <svg
          viewBox="0 0 320 240"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect x="12" y="12" width="296" height="216" stroke="currentColor" />
          <path d="M28 56H292" stroke="currentColor" opacity="0.6" />
          <path d="M28 104H292" stroke="currentColor" opacity="0.6" />
          <path d="M28 152H292" stroke="currentColor" opacity="0.6" />
          <rect x="40" y="30" width="160" height="14" stroke="currentColor" opacity="0.75" />
          <rect x="40" y="72" width="200" height="14" stroke="currentColor" opacity="0.75" />
          <rect x="40" y="120" width="180" height="14" stroke="currentColor" opacity="0.75" />
          <rect x="40" y="168" width="210" height="14" stroke="currentColor" opacity="0.75" />
        </svg>
      </div>
      <div className="mt-6 text-xs text-muted-foreground">
        Deterministic execution, sources attached, and a run you can replay.
      </div>
    </div>
  );
}

export default function StackSection() {
  return (
    <section id="stack" className="section-light section-grid overflow-hidden">
      <div className="dotted-divider" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="subhead justify-center">
            <span className="subhead-square" />
            <span>Batteries Included</span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold text-balance">
            Everything you need to ship reliable work.
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center">
          <div className="space-y-6">
            {itemsLeft.map((i) => (
              <div key={i.title} className="border border-border bg-white p-6 hover-lift">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  {i.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {i.detail}
                </p>
              </div>
            ))}
          </div>

          <CenterVisual />

          <div className="space-y-6">
            {itemsRight.map((i) => (
              <div key={i.title} className="border border-border bg-white p-6 hover-lift">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  {i.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {i.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dotted-divider" aria-hidden="true" />
    </section>
  );
}
