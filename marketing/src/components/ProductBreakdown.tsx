import { useState } from "react";
import ArrowIcon from "./ArrowIcon";

type Tab = {
  title: string;
  description: string;
  visualLabel: string;
};

const tabs: Tab[] = [
  {
    title: "Workflow compiler",
    description:
      "Turn a reliable playbook into an executable run. Steps are ordered, tools are explicit, and the run is reproducible.",
    visualLabel: "visual 2.1",
  },
  {
    title: "Tool contracts",
    description:
      "Inputs and outputs are structured. You see what the model asked for, what the tool returned, and what got published.",
    visualLabel: "visual 2.2",
  },
  {
    title: "Sandboxed execution",
    description:
      "Deterministic steps run inside a safe boundary so execution stays predictable and isolated.",
    visualLabel: "visual 2.3",
  },
  {
    title: "Tracing and review",
    description:
      "Every run produces logs and a reviewable timeline so teams can debug, approve, and rerun with confidence.",
    visualLabel: "visual 2.4",
  },
];

function Visual({ label, title }: { label: string; title: string }) {
  return (
    <div className="border border-border bg-foreground p-4 text-background">
      <div className="flex items-center justify-between text-xs text-background/70">
        <div className="flex items-center gap-2">
          <span className="subhead-square" />
          <span className="label-mono">{label}</span>
        </div>
        <span className="label-mono text-background/60">tenex</span>
      </div>
      <div className="mt-4 aspect-[16/10] border border-border/60 p-4 text-[10px] text-background/70">
        <svg
          viewBox="0 0 320 200"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect x="12" y="12" width="296" height="176" stroke="currentColor" />
          <path d="M24 46H296" stroke="currentColor" opacity="0.6" />
          <path d="M24 86H296" stroke="currentColor" opacity="0.6" />
          <path d="M24 126H296" stroke="currentColor" opacity="0.6" />
          <path d="M24 166H296" stroke="currentColor" opacity="0.6" />

          <rect x="32" y="26" width="120" height="10" stroke="currentColor" opacity="0.75" />
          <rect x="32" y="66" width="172" height="10" stroke="currentColor" opacity="0.75" />
          <rect x="32" y="106" width="148" height="10" stroke="currentColor" opacity="0.75" />
          <rect x="32" y="146" width="196" height="10" stroke="currentColor" opacity="0.75" />
        </svg>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-background/60">
        <span className="label-mono text-background/60">tenex</span>
        <span className="label-mono text-background/60">{title.toLowerCase()}</span>
      </div>
    </div>
  );
}

export default function ProductBreakdown() {
  const [active, setActive] = useState(0);
  const activeTab = tabs[active] ?? tabs[0];

  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="subhead reveal">
                <span className="subhead-square" />
                <span>Our Products [02]</span>
              </div>
              <h2 className="text-3xl font-semibold text-balance reveal reveal-delay-1">
                A deterministic runtime for high stakes work.
              </h2>
              <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground reveal reveal-delay-2">
                Tenex is more than chat. When you enable workflow mode, you get a runtime that produces reviewable, repeatable execution inside the same thread.
              </p>
              <div className="reveal reveal-delay-3">
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

            <div className="border border-border bg-foreground text-background">
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3 text-xs uppercase tracking-[0.2em] text-background/70">
                <span className="subhead-square" />
                <span>Reliable execution</span>
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
                          {tab.description}
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
