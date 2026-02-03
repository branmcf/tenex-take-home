import { ReactNode } from "react";

export default function SectionShell({
  children,
  tone = "light",
  id,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={tone === "dark" ? "section-dark" : "section-light"}
    >
      {children}
    </section>
  );
}
