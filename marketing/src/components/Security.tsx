import ArrowIcon from "./ArrowIcon";

function ShieldIcon() {
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
        d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SecurityVisual() {
  return (
    <div className="border border-border bg-white p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="subhead-square" />
          <span className="label-mono">security</span>
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
          <path d="M28 64H292" stroke="currentColor" opacity="0.6" />
          <path d="M28 120H292" stroke="currentColor" opacity="0.6" />
          <path d="M28 176H292" stroke="currentColor" opacity="0.6" />
          <rect x="40" y="32" width="120" height="16" stroke="currentColor" opacity="0.75" />
          <rect x="40" y="88" width="200" height="16" stroke="currentColor" opacity="0.75" />
          <rect x="40" y="144" width="170" height="16" stroke="currentColor" opacity="0.75" />
          <rect x="40" y="200" width="140" height="16" stroke="currentColor" opacity="0.75" />
        </svg>
      </div>
      <div className="mt-6 text-xs text-muted-foreground">
        Audit logs, sandbox boundaries, and project isolation by default.
      </div>
    </div>
  );
}

function SecurityItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border bg-white px-6 py-5">
      <div className="flex items-start gap-4">
        <div className="mt-1 text-muted-foreground">
          <ShieldIcon />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}

export default function Security() {
  return (
    <section id="security" className="section-light section-grid overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="subhead justify-center reveal">
            <span className="subhead-square" />
            <span>Security</span>
          </div>
          <h2 className="mt-6 text-3xl font-semibold text-balance reveal reveal-delay-1">
            Security built for deterministic workflows.
          </h2>
          <div className="mt-8 flex justify-center reveal reveal-delay-2">
            <a
              className="button"
              data-text-color="black"
              data-border-color="black"
              data-arrow-color="black"
              href="#access"
            >
              <div className="button-text">Learn more</div>
              <span className="button-arrow">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-center">
          <div className="space-y-6">
            <SecurityItem
              title="Tracing and observability"
              body="Full traces for every run with timing, tool calls, and a reviewable execution path."
            />
            <SecurityItem
              title="Sandboxed tools"
              body="Tool calls execute inside isolated sandboxes to protect the host environment and data."
            />
          </div>

          <SecurityVisual />

          <div className="space-y-6">
            <SecurityItem
              title="Project isolation"
              body="Each workspace has isolated data boundaries with clear access controls and audit trails."
            />
            <SecurityItem
              title="Compliance ready"
              body="Designed for teams that need to operate with strong controls and clear evidence."
            />
            <SecurityItem
              title="Reviewable outputs"
              body="Every published result can point back to sources and tool outputs for verification."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

