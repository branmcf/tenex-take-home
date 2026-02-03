import ArrowIcon from "./ArrowIcon";

function MetricIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 18V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M10 18V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M16 18V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M22 18V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="5" cy="10" r="1.3" fill="currentColor" opacity="0.8" />
      <circle cx="10" cy="10" r="1.3" fill="currentColor" opacity="0.8" />
      <circle cx="15" cy="10" r="1.3" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

function CodeGraphic() {
  return (
    <div className="border border-border bg-foreground text-background">
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3 text-xs text-background/70">
        <DotsIcon />
        <div className="label-mono text-background/70">tenex_workflow.py</div>
      </div>
      <div className="p-4">
        <pre className="m-0 overflow-auto font-mono text-[12px] leading-relaxed text-background/70">
          <code>
            <span className="accent-green">from</span> tenex{" "}
            <span className="accent-green">import</span> workflow, web, publish
            {"\n\n"}
            <span className="accent-green">@workflow</span>()
            {"\n"}
            <span className="accent-green">def</span>{" "}
            <span className="text-background">draft_brief</span>(query:{" "}
            <span className="accent-green">str</span>) -&gt;{" "}
            <span className="accent-green">str</span>:
            {"\n"}
            {"  "}sources = web.search(query).cite()
            {"\n"}
            {"  "}draft = publish.write(sources)
            {"\n"}
            {"  "}
            <span className="accent-green">return</span> draft
            {"\n\n"}
            <span className="accent-green">@workflow</span>(pinned_tools=
            <span className="text-background">'on'</span>)
            {"\n"}
            <span className="accent-green">def</span>{" "}
            <span className="text-background">runbook</span>(incident_id:{" "}
            <span className="accent-green">str</span>) -&gt;{" "}
            <span className="accent-green">dict</span>:
            {"\n"}
            {"  "}steps = ["triage", "mitigate", "verify", "postmortem"]
            {"\n"}
            {"  "}
            <span className="accent-green">return</span> {"{"}"steps": steps{"}"}
          </code>
        </pre>
      </div>
    </div>
  );
}

function WorkflowItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border bg-card px-6 py-5">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-[28ch]">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
            {title}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <div className="text-muted-foreground">
          <MetricIcon />
        </div>
      </div>
    </div>
  );
}

export default function Workflows() {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="border-t border-border pt-10">
          <div className="subhead reveal">
            <span className="subhead-square" />
            <span>Data workflows</span>
          </div>
          <h2 className="mt-6 max-w-3xl text-3xl font-semibold text-balance reveal reveal-delay-1">
            The runtime for deterministic workflow automation.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <WorkflowItem
            title="PERSISTENT RUN HISTORY"
            body="Each run keeps inputs, outputs, and citations attached so teams can review and rerun."
          />

          <div className="lg:row-span-2">
            <CodeGraphic />
          </div>

          <WorkflowItem
            title="PINNED TOOLS"
            body="Workflow mode pins tools and contracts so tool calls stay consistent across reruns."
          />

          <WorkflowItem
            title="NO SILENT RETRIES"
            body="Failures stay visible. Fix the step, rerun from the same state, ship the same output again."
          />

          <WorkflowItem
            title="FAST UNDER LOAD"
            body="Predictable execution keeps throughput steady when multiple teams are running workflows."
          />
        </div>

        <div className="mt-12">
          <a
            className="button"
            data-text-color="green 1"
            data-border-color="green 1"
            data-arrow-color="green 1"
            href="#access"
          >
            <div className="button-text">Talk to engineering</div>
            <span className="button-arrow">
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

