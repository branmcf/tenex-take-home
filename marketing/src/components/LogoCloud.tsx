const logos = ["Nova Labs", "Helix AI", "Parity", "Signals", "Arcadia", "Argo"];
const loopLabels = ["ENGINEERING", "SECURITY", "OPS", "RESEARCH"];

export default function LogoCloud() {
  const loop = [...logos, ...logos];
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between border-y border-border py-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>Powering world class teams:</span>
          <div className="vertical-loop is-animate hidden sm:block">
            <div className="vertical-loop-track">
              {loopLabels.map((label) => (
                <div key={label} className="label-mono text-[10px] text-muted-foreground">
                  {label}
                </div>
              ))}
            </div>
            <div className="vertical-loop-track" aria-hidden="true">
              {loopLabels.map((label) => (
                <div key={`${label}-2`} className="label-mono text-[10px] text-muted-foreground">
                  {label}
                </div>
              ))}
            </div>
          </div>
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
