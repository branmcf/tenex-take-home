import { useState } from "react";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="section-light">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="border border-border bg-white p-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="subhead">
                <span className="subhead-square" />
                <span>Newsletter</span>
              </div>
              <h2 className="text-3xl font-semibold text-balance">
                Product updates, new workflows, and shipping notes.
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Short emails. Practical changes. No noise.
              </p>
            </div>

            <div className="border border-border p-6">
              {submitted ? (
                <div className="text-sm text-muted-foreground">
                  Thanks, you are on the list.
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label className="block">
                    <div className="label-mono text-muted-foreground">Email</div>
                    <input
                      required
                      type="email"
                      placeholder="you@company.com"
                      className="mt-2 h-10 w-full border border-border bg-white px-3 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <label className="block">
                    <div className="label-mono text-muted-foreground">Name</div>
                    <input
                      required
                      type="text"
                      placeholder="Full name"
                      className="mt-2 h-10 w-full border border-border bg-white px-3 text-sm outline-none focus:border-primary"
                    />
                  </label>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="button"
                      data-text-color="green 1"
                      data-border-color="green 1"
                      data-arrow-color="green 1"
                    >
                      <div className="button-text">Sign up</div>
                    </button>
                    <a
                      href="#access"
                      className="button"
                      data-text-color="black"
                      data-border-color="black"
                      data-arrow-color="black"
                    >
                      <div className="button-text">Request a demo</div>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
