const cards = [
  {
    title: "Search + Chat by default",
    detail: "Ask a question, get a cited answer, and keep going in the same thread.",
  },
  {
    title: "Workflows when it counts",
    detail: "Turn a conversation into a repeatable run with explicit steps and tools.",
  },
  {
    title: "Reliable handoff",
    detail: "Share the run history so anyone can pick up where the model left off.",
  },
];

export default function PlatformSplit() {
  return (
    <section id="platform" className="section-light section-grid">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="subhead reveal">
              <span className="subhead-square" />
              <span>Platform Overview</span>
            </div>
            <h2 className="text-3xl font-semibold">
              Start with answers. Add guarantees only when you need them.
            </h2>
            <p className="max-w-[56ch] text-sm text-muted-foreground">
              Tenex gives you the speed of AI search and chat, plus a deterministic path
              for high-stakes work. It is the same conversation, just with a switch for
              reliability.
            </p>
            <div className="mt-6 grid gap-4">
              {cards.map((card) => (
                <div key={card.title} className="panel p-5 hover-lift">
                  <p className="text-base font-semibold">{card.title}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6 hover-lift">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="label-mono">Product Demo</span>
              <span className="accent-green">Placeholder</span>
            </div>
            <div className="mt-6 border border-border bg-background/80 p-4">
              <div className="flex aspect-[16/9] items-center justify-center border border-dashed border-border text-xs text-muted-foreground">
                Insert video or image of search-to-workflow flow.
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="label-mono">Scene</span>
                <span>Search → Answer → Workflow Run</span>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-xs text-muted-foreground">
              <p>Show a live web answer first, then the workflow toggle switching on.</p>
              <p>Highlight the deterministic run and the published output.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
