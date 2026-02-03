const metrics = [
  { value: "Cited", label: "Web Answers" },
  { value: "1 click", label: "Workflow On/Off" },
  { value: "0", label: "Hidden Fallbacks" },
  { value: "Pinned", label: "Repeatable Runs" },
];

const HERO_VIDEO_SRC = "https://pub-26ea6282fa24439493c91bf324dd1256.r2.dev/1.5.mp4";

export default function Hero() {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav className="nav-shell">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center border border-border text-[10px] font-semibold text-foreground">
              TX
            </span>
            <span>Tenex</span>
          </div>
          <div className="nav-links hidden md:flex">
            <a className="transition hover:text-foreground" href="#platform">
              Platform
            </a>
            <a className="transition hover:text-foreground" href="#execution">
              Execution
            </a>
            <a className="transition hover:text-foreground" href="#stack">
              Stack
            </a>
            <a className="transition hover:text-foreground" href="#access">
              Access
            </a>
            <a
              className="btn btn-outline btn-flat"
              href="https://bplex.branmcf.com"
            >
              Open App
            </a>
          </div>
        </nav>
      </div>

      <div className="hero-section">
        <div className="hero-grid-overlay blueprint-grid" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="pb-16 pt-20 animate-fade-in">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="subhead reveal">
                <span className="subhead-square" />
                <span>Search + Chat, With Guarantees</span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl reveal reveal-delay-1">
                A search-first AI that ships answers.{" "}
                <span className="accent-green">Workflows when you need certainty.</span>
              </h1>

              <p className="mt-6 max-w-[72ch] text-sm leading-relaxed text-muted-foreground sm:text-base reveal reveal-delay-2">
                Tenex is AI-powered web search and chat. When a task needs to be reliable, switch on deterministic workflows inside the conversation. You get fast answers by default, and repeatable execution when it matters.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 reveal reveal-delay-3">
                <button className="btn btn-primary btn-flat">Request Access</button>
                <button className="btn btn-outline btn-flat">Watch the Demo</button>
              </div>
            </div>

            <div className="mt-12">
              <div className="overflow-hidden rounded-[8px] border border-border bg-card">
                <div className="relative aspect-[16/9]">
                  <video
                    src={HERO_VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-6">
          <div className="stat-grid sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="stat-item">
                <strong>{metric.value}</strong>
                <span className="label-mono text-[10px] text-muted-foreground">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
