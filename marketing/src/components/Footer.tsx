export default function Footer() {
  return (
    <footer className="section-dark">
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-6 text-xs text-muted-foreground">
        <div className="flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center border border-border text-[10px] font-semibold text-foreground">
              TX
            </span>
            <span className="label-mono text-muted-foreground">Tenex</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a className="transition hover:text-foreground" href="#platform">
              Platform
            </a>
            <a className="transition hover:text-foreground" href="#execution">
              Execution
            </a>
            <a className="transition hover:text-foreground" href="#access">
              Access
            </a>
            <a className="transition hover:text-foreground" href="https://bplex.branmcf.com">
              Open App
            </a>
          </div>
          <p>© 2026 Tenex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
