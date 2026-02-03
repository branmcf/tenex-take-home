type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Tenex made our research workflow faster without giving up rigor. When the task is high stakes, switching into deterministic mode gives us confidence in the output.",
    name: "Vincent Di Pietro",
    title: "Founder, Novis AI",
  },
  {
    quote:
      "We needed cited answers for day to day questions and repeatable runs for operations. Tenex keeps both in the same conversation and the handoff story is clean.",
    name: "Boyan Dimitrov",
    title: "CTO, SIXT",
  },
  {
    quote:
      "The difference is auditability. You can review what happened, see sources, and replay the run. That makes it usable for real teams.",
    name: "Yaroslav Sklabinskyi",
    title: "Principal Software Engineer, Reliant AI",
  },
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-xs font-semibold text-foreground">
      {initials}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section-light section-grid">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="subhead reveal">
              <span className="subhead-square" />
              <span>Trusted by Pro Devs Globally</span>
            </div>
            <h2 className="text-3xl font-semibold text-balance reveal reveal-delay-1">
              Built for teams who ship, not teams who demo.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground reveal reveal-delay-2">
              Tenex is designed for real work. Search and chat get you to an answer fast. Deterministic runs make the answer repeatable when it matters.
            </p>
          </div>

          <div className="grid gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="panel p-6 hover-lift">
                <h3 className="text-base font-semibold leading-snug">{t.quote}</h3>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar name={t.name} />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

