import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemedAuthImage } from "@/components/auth/ThemedAuthImage";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-8 md:p-16">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <LogoMark size={32} className="h-8 w-8" />
            <span className="text-lg">HardWire</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-background relative hidden lg:block">
        <ThemedAuthImage alt="Login illustration" />
      </div>
    </div>
  );
}
