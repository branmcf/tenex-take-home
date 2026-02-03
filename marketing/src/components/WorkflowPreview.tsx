const nodes = [
  { id: "A1", title: "Ingest", detail: "Normalize input" },
  { id: "B2", title: "Compile", detail: "Build DAG" },
  { id: "C3", title: "Execute", detail: "Run steps" },
  { id: "D4", title: "Publish", detail: "Return output" },
];

export default function WorkflowPreview() {
  return (
    <section id="platform" className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <p className="label-mono text-muted-foreground">Workflow Compiler</p>
          <h2 className="text-3xl font-semibold">From language to executable DAG.</h2>
          <p className="text-sm text-muted-foreground">
            Describe your process once, then run it with strict ordering and observable
            tool usage. Tenex stores the natural language description alongside the
            compiled graph for traceability.
          </p>
          <div className="grid gap-4">
            <div className="panel p-4">
              <p className="text-xs text-muted-foreground">Input</p>
              <p className="mt-2 text-sm">
                Research the request, draft decision steps, validate with tools, publish.
              </p>
            </div>
            <div className="panel p-4">
              <p className="text-xs text-muted-foreground">Output</p>
              <p className="mt-2 text-sm">DAG v3 • 4 steps • 0 retries</p>
            </div>
          </div>
        </div>

        <div className="panel p-6 hover-lift">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="label-mono">Execution Graph</span>
            <span>Version 03</span>
          </div>
          <div className="mt-6 grid gap-3">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-between border border-border px-4 py-3 transition-colors duration-200 ease-out hover:bg-accent/20"
              >
                <div>
                  <p className="text-sm font-medium">{node.title}</p>
                  <p className="text-xs text-muted-foreground">{node.detail}</p>
                </div>
                <span className="label-mono text-xs text-muted-foreground">{node.id}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            <div className="border border-border px-3 py-2">Queued</div>
            <div className="border border-border px-3 py-2">Running</div>
            <div className="border border-border px-3 py-2">Passed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
