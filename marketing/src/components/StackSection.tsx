const stackItems = [
  {
    title: "Research to memo",
    detail: "Collect sources, synthesize, and publish a clean answer with citations.",
  },
  {
    title: "Customer insights",
    detail: "Scan reviews, tag themes, and deliver a weekly summary you can repeat.",
  },
  {
    title: "Ops runbooks",
    detail: "Kick off deterministic workflows for incidents or compliance checks.",
  },
];

export default function StackSection() {
  return (
    <section id="stack" className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="subhead reveal">
              <span className="subhead-square" />
              <span>Real Work</span>
            </div>
            <h2 className="text-3xl font-semibold">
              The flow from question to action, without switching tools.
            </h2>
            <p className="max-w-[56ch] text-sm text-muted-foreground">
              Tenex keeps search, chat, and deterministic execution in one place so teams
              can ship answers fast and still trust the result later.
            </p>
            <div className="mt-6 space-y-4">
              {stackItems.map((item) => (
                <div key={item.title} className="border border-border px-4 py-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6 hover-lift">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="label-mono">Sample Runbook</span>
              <span className="accent-green">Deterministic Mode</span>
            </div>
            <div className="mt-6 grid gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-[120px_1fr] gap-4 border border-border p-3 text-xs">
                  <span className="label-mono text-muted-foreground">Layer 0{index + 1}</span>
                  <span className="text-muted-foreground">
                    Step {index + 1}: tools and outputs pinned to this run.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
