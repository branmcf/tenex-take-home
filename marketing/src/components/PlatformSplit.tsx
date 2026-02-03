import { useMemo, useState } from "react";
import ArrowIcon from "./ArrowIcon";

type Tab = {
  title: string;
  description: string;
  visualLabel: string;
};

const tabs: Tab[] = [
  {
    title: "Cited web answers",
    description:
      "Answers are grounded in sources. Tenex keeps citations attached so teams can validate and publish with confidence.",
    visualLabel: "visual 1.1",
  },
  {
    title: "Deterministic workflow mode",
    description:
      "Flip one switch and the conversation becomes a run. Steps are explicit, tools are pinned, and outputs are repeatable.",
    visualLabel: "visual 1.2",
  },
  {
    title: "Fail fast execution",
    description:
      "No silent retries. If a step fails, you see the break, fix it, and rerun from the same state.",
    visualLabel: "visual 1.3",
  },
  {
    title: "Clean handoffs",
    description:
      "Share the run history with your team. Anyone can review what happened and pick up where it left off.",
    visualLabel: "visual 1.4",
  },
];

function Visual({ label, title }: { label: string; title: string }) {
  return (
    <div className="border border-border bg-background/80 p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="subhead-square" />
          <span className="label-mono">{label}</span>
        </div>
        <span className="label-mono text-muted-foreground">tenex</span>
      </div>
      <div className="mt-4 aspect-[16/10] border border-border p-4 text-[10px] text-muted-foreground">
        <svg
          viewBox="0 0 320 200"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect x="12" y="12" width="296" height="176" stroke="currentColor" />
          <path d="M24 56H296" stroke="currentColor" opacity="0.6" />
          <path d="M24 96H296" stroke="currentColor" opacity="0.6" />
          <path d="M24 136H296" stroke="currentColor" opacity="0.6" />
          <rect x="32" y="28" width="208" height="12" stroke="currentColor" opacity="0.7" />
          <rect x="32" y="68" width="144" height="12" stroke="currentColor" opacity="0.7" />
          <rect x="32" y="108" width="164" height="12" stroke="currentColor" opacity="0.7" />
          <rect x="32" y="148" width="120" height="12" stroke="currentColor" opacity="0.7" />
        </svg>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="label-mono text-muted-foreground">tenex</span>
        <span className="label-mono text-muted-foreground">{title.toLowerCase()}</span>
      </div>
    </div>
  );
}

export default function PlatformSplit() {
  const [active, setActive] = useState(0);

  const activeTab = tabs[active] ?? tabs[0];

  const bodies = useMemo(() => {
    return tabs.map((t) => t.description);
  }, []);

  return (
    <section id="platform" className="section-light section-grid">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="subhead reveal">
                <span className="subhead-square" />
                <span>Our Products [01]</span>
              </div>
              <h2 className="text-3xl font-semibold text-balance reveal reveal-delay-1">
                The production stack for search first, workflows when it counts.
              </h2>
              <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground reveal reveal-delay-2">
                Tenex is built for teams who live in research, writing, and decisions. Start with cited answers, then switch into deterministic execution when you need guarantees.
              </p>
              <div className="reveal reveal-delay-3">
                <a
                  className="button"
                  data-text-color="green 3"
                  data-border-color="green 3"
                  data-arrow-color="green 3"
                  href="#access"
                >
                  <div className="button-text">View product breakdown</div>
                  <span className="button-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              </div>
            </div>

            <div className="border border-border bg-foreground text-background">
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3 text-xs uppercase tracking-[0.2em] text-background/70">
                <span className="subhead-square" />
                <span>Agent Native Platform</span>
              </div>

              <div className="divide-y divide-border/60">
                {tabs.map((tab, idx) => {
                  const isActive = idx === active;
                  return (
                    <button
                      key={tab.title}
                      type="button"
                      onClick={() => setActive(idx)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-6 px-4 py-4">
                        <div className="text-sm font-semibold text-background">
                          {tab.title}
                        </div>
                        <div className="label-mono text-[10px] text-background/60">
                          {isActive ? "ACTIVE" : "OPEN"}
                        </div>
                      </div>
                      <div className={`feature-tab-body ${isActive ? "is-open" : ""}`}>
                        <div className="feature-tab-body-inner px-4 pb-4 text-sm text-background/70">
                          {bodies[idx]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:pt-12">
            <Visual label={activeTab.visualLabel} title={activeTab.title} />
          </div>
        </div>
      </div>
    </section>
  );
}
