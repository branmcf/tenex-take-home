const logos = ["Nova Labs", "Helix AI", "Parity", "Signals", "Arcadia", "Argo"];

export default function LogoCloud() {
  const loop = [...logos, ...logos];
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between border-y border-border py-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>Trusted by Operators</span>
          <span className="hidden sm:inline">Search + Deterministic Runs</span>
        </div>
        <div className="mt-6 overflow-hidden">
          <div className="logo-row">
            {loop.map((logo, index) => (
              <div key={`${logo}-${index}`} className="logo-item">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
