const features = [
  {
    title: "Cited web answers",
    detail: "Search with sources attached so decisions can be defended."
  },
  {
    title: "Live context",
    detail: "Keep the full thread, files, and research in one place."
  },
  {
    title: "Workflow toggle",
    detail: "Switch deterministic mode on when you need repeatable outcomes."
  },
  {
    title: "Fail-fast runs",
    detail: "No hidden retries. You see the break and fix it immediately."
  },
  {
    title: "Tool transparency",
    detail: "Every call, input, and output is logged for review."
  },
  {
    title: "Run history",
    detail: "Find what was done, when, and why without rebuilding context."
  }
];

export default function FeatureGrid() {
  return (
    <section id="execution" className="section-light section-grid">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 border-b border-border pb-6">
          <div className="subhead reveal">
            <span className="subhead-square" />
            <span>What You Get</span>
          </div>
          <h2 className="text-3xl font-semibold">Speed by default, rigor on demand.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="panel p-5 hover-lift"
            >
              <p className="text-base font-semibold">{feature.title}</p>
              <p className="mt-3 text-sm text-muted-foreground">{feature.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
