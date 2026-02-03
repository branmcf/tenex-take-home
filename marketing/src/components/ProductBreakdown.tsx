const modules = [
  {
    title: "Answer Quality You Can Trust",
    summary:
      "Web search and chat that surfaces sources, keeps context, and avoids hallucinated certainty.",
    meta: ["Cited sources", "Context memory", "Clear confidence"],
  },
  {
    title: "Repeatability When It Matters",
    summary:
      "Turn a reliable playbook into a workflow that runs the same way every time.",
    meta: ["Pinned steps", "Tool contracts", "Deterministic runs"],
  },
  {
    title: "Accountability for Teams",
    summary:
      "Every output can be traced back to steps, tools, and sources for clean handoffs.",
    meta: ["Run history", "Audit trail", "Searchable logs"],
  },
];

function Diagram({ accentIndex }: { accentIndex: number }) {
  const nodes = ["A1", "B2", "C3", "D4", "E5", "F6"];
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="16" y="16" width="288" height="168" stroke="currentColor" />
      {nodes.map((node, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = 36 + col * 92;
        const y = 40 + row * 60;
        return (
          <g key={node}>
            <rect
              x={x}
              y={y}
              width="72"
              height="32"
              stroke="currentColor"
              fill={index === accentIndex ? "currentColor" : "none"}
              opacity={index === accentIndex ? 0.2 : 1}
            />
            <text
              x={x + 36}
              y={y + 20}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity={0.8}
            >
              {node}
            </text>
          </g>
        );
      })}
      <path d="M72 72H120" stroke="currentColor" />
      <path d="M164 72H212" stroke="currentColor" />
      <path d="M72 132H120" stroke="currentColor" />
      <path d="M164 132H212" stroke="currentColor" />
      <path d="M72 72V132" stroke="currentColor" />
      <path d="M164 72V132" stroke="currentColor" />
      <path d="M256 72V132" stroke="currentColor" />
    </svg>
  );
}

export default function ProductBreakdown() {
  return (
    <section className="section-light">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 border-b border-border pb-6">
          <div className="subhead reveal">
            <span className="subhead-square" />
            <span>Why It Works</span>
          </div>
          <h2 className="text-3xl font-semibold">
            Answers first. Reliability when needed.
          </h2>
          <p className="max-w-[56ch] text-sm text-muted-foreground">
            Tenex is built for fast decision-making with a clean path to guaranteed
            execution. You can move from research to repeatable action without switching
            tools.
          </p>
        </div>
        <div className="mt-8 grid gap-6">
          {modules.map((module, index) => (
            <div
              key={module.title}
              className="grid gap-6 border border-border p-6 hover-lift lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="label-mono">Layer 0{index + 1}</span>
                  <span>{module.meta[0]}</span>
                </div>
                <h3 className="text-2xl font-semibold">{module.title}</h3>
                <p className="text-sm text-muted-foreground">{module.summary}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {module.meta.map((item) => (
                    <span key={item} className="border border-border px-3 py-2">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
                <div className="border border-border bg-background/60 p-4 text-muted-foreground">
                  <div className="flex items-center justify-between text-xs">
                    <span className="label-mono">Supporting Visual</span>
                    <span className="accent-green">Placeholder</span>
                  </div>
                <div className="mt-4 aspect-[16/9] border border-border p-3 text-[10px]">
                  <Diagram accentIndex={index + 1} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
