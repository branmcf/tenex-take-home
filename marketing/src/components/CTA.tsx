export default function CTA() {
  return (
    <section id="access" className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="panel grid gap-6 p-8 hover-lift md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="subhead">
            <span className="subhead-square" />
            <span>Early Access</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold">
            Get answers fast. Make the ones that matter repeatable.
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            We onboard teams that live in search and need a reliable path to execution.
            Bring a real use case and we will build the workflow with you.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div className="border border-border p-4 text-sm text-muted-foreground">
            <p className="label-mono">Includes</p>
            <ul className="mt-3 space-y-2">
              <li>Cited search + chat</li>
              <li>Deterministic workflow runs</li>
              <li>Team handoff history</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary btn-flat">
              Request Access
            </button>
            <button className="btn btn-outline btn-flat">
              Book a Call
            </button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
