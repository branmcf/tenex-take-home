import ArrowIcon from "./ArrowIcon";

type FeatureAlt = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: Array<{ heading: string; sub: string }>;
  flipped?: boolean;
};

const sections: FeatureAlt[] = [
  {
    eyebrow: "PRODUCT",
    title: "Deterministic Workflows, Built In",
    body:
      "When the job needs guarantees, Tenex turns a chat into a run. Steps are explicit, tools are pinned, and outputs are repeatable. No hidden fallbacks, no silent retries.",
    bullets: [
      { heading: "0 hidden fallbacks", sub: "If something breaks, you see it and fix it." },
      { heading: "Pinned steps", sub: "The run is the source of truth, not the model." },
      { heading: "Auditable outputs", sub: "Every result ties back to tools and sources." },
    ],
  },
  {
    eyebrow: "PRODUCT",
    title: "Cited Answers That Hold Up",
    body:
      "Fast web answers are useful only if you can trust them. Tenex keeps sources attached, preserves context, and makes it easy to validate before you publish.",
    bullets: [
      { heading: "Sources attached", sub: "Every claim can point to evidence." },
      { heading: "Context kept", sub: "Threads preserve what you already learned." },
      { heading: "Publishable drafts", sub: "Move from research to output in one flow." },
    ],
    flipped: true,
  },
  {
    eyebrow: "PRODUCT",
    title: "Built for Teams, Not Demos",
    body:
      "Runs are shareable. Handoffs are clean. Review is simple. Tenex is designed for real workflows that multiple people touch over time.",
    bullets: [
      { heading: "Run history", sub: "See what happened, when, and why." },
      { heading: "Review friendly", sub: "Logs and steps are readable and searchable." },
      { heading: "Repeatable ops", sub: "Turn best practices into workflows." },
    ],
  },
];

function VisualPlaceholder({ label }: { label: string }) {
  return (
    <div className="border border-border bg-background/80 p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="label-mono">visual</span>
        <span className="label-mono">{label}</span>
      </div>
      <div className="mt-4 aspect-[16/10] border border-border p-4 text-[10px] text-muted-foreground">
        <svg
          viewBox="0 0 320 200"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <rect x="12" y="12" width="296" height="176" stroke="currentColor" />
          <path d="M24 52H296" stroke="currentColor" opacity="0.6" />
          <path d="M24 92H296" stroke="currentColor" opacity="0.6" />
          <path d="M24 132H296" stroke="currentColor" opacity="0.6" />
          <rect x="32" y="28" width="88" height="12" stroke="currentColor" opacity="0.7" />
          <rect x="32" y="68" width="144" height="12" stroke="currentColor" opacity="0.7" />
          <rect x="32" y="108" width="112" height="12" stroke="currentColor" opacity="0.7" />
          <rect x="32" y="148" width="164" height="12" stroke="currentColor" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}

function FeatureAltSection({ section }: { section: FeatureAlt }) {
  const wrapper = section.flipped ? "lg:flex-row-reverse" : "lg:flex-row";
  return (
    <div className="border-b border-border py-16">
      <div className={`mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:items-start ${wrapper}`}>
        <div className="w-full lg:w-[52%]">
          <VisualPlaceholder label={section.eyebrow.toLowerCase()} />
        </div>

        <div className="w-full lg:w-[48%]">
          <div className="space-y-6">
            <div className="subhead">
              <span className="subhead-square" />
              <span>{section.eyebrow}</span>
            </div>
            <h2 className="text-3xl font-semibold text-balance">{section.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </div>

          <div className="mt-8 space-y-3">
            {section.bullets.map((b) => (
              <div
                key={b.heading}
                className="flex items-start justify-between gap-6 border border-border px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold">{b.heading}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.sub}</div>
                </div>
                <div className="text-muted-foreground">
                  <span className="subhead-square" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              className="button"
              data-text-color="green 1"
              data-border-color="green 1"
              data-arrow-color="green 1"
              href="#access"
            >
              <div className="button-text">Talk to sales</div>
              <span className="button-arrow">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeatureAlts() {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="subhead reveal">
          <span className="subhead-square" />
          <span>Product</span>
        </div>
        <h2 className="mt-6 max-w-3xl text-3xl font-semibold text-balance reveal reveal-delay-1">
          The production stack for search, chat, and deterministic execution.
        </h2>
      </div>

      <div className="mt-10 border-t border-border">
        {sections.map((section) => (
          <FeatureAltSection key={section.title} section={section} />
        ))}
      </div>
    </section>
  );
}
