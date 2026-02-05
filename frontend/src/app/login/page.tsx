import Link from "next/link";
import { Stack } from "@phosphor-icons/react/dist/ssr";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemedAuthImage } from "@/components/auth/ThemedAuthImage";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-8 md:p-16">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Stack className="size-5" weight="bold" />
            </div>
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
