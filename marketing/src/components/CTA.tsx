import ArrowIcon from "./ArrowIcon";

export default function CTA() {
  return (
    <section id="access" className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden border border-border bg-foreground text-background">
          <div className="cta-lines-wrapper">
            <div className="cta-lines-row">
              <svg
                width="720"
                height="56"
                viewBox="0 0 720 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full"
                aria-hidden="true"
              >
                {Array.from({ length: 18 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M${i * 40} 28 H${i * 40 + 28}`}
                    stroke="rgba(130,195,140,0.9)"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                ))}
              </svg>
              <svg
                width="720"
                height="56"
                viewBox="0 0 720 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full"
                aria-hidden="true"
              >
                {Array.from({ length: 18 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M${i * 40} 28 H${i * 40 + 28}`}
                    stroke="rgba(130,195,140,0.9)"
                    strokeWidth="2"
                    opacity="0.35"
                  />
                ))}
              </svg>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 opacity-40 cta-grid" aria-hidden="true" />
            <div className="relative grid gap-8 p-10 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-balance">
                  Get deterministic execution for the work that matters.
                </h2>
                <p className="text-sm leading-relaxed text-background/70">
                  Tenex ships cited answers fast. When the task is high stakes, workflow mode turns the conversation into a run with explicit steps and reviewable output.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    className="button"
                    data-text-color="green 1"
                    data-border-color="green 1"
                    data-arrow-color="green 1"
                    href="https://bplex.branmcf.com"
                  >
                    <div className="button-text">Try Tenex</div>
                    <span className="button-arrow">
                      <ArrowIcon />
                    </span>
                  </a>
                  <a
                    className="button"
                    data-text-color="white"
                    data-border-color="white"
                    data-arrow-color="white"
                    href="#access"
                  >
                    <div className="button-text">Request a demo</div>
                  </a>
                </div>
              </div>

              <div className="border border-border/60 bg-background/5 p-6 text-sm text-background/70">
                <div className="label-mono text-background/60">Includes</div>
                <ul className="mt-4 space-y-2">
                  <li>Cited search and chat</li>
                  <li>Deterministic workflow runs</li>
                  <li>Run history and review</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
