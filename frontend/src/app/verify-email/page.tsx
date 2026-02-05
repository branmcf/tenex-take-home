"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Stack, EnvelopeSimple } from "@phosphor-icons/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? undefined;

  return (
    <div className="flex min-h-svh flex-col blueprint-dots">
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
      </div>

      <div className="flex flex-1 items-center justify-center px-8 pb-16">
        <div className="flex flex-col items-center gap-8 text-center max-w-md">
          <div className="flex size-16 items-center justify-center bg-muted border border-border rounded-lg">
            <EnvelopeSimple className="size-8 text-muted-foreground" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
            <p className="text-muted-foreground">
              We&apos;ve sent you a verification link to your email address.
              Please click the link to verify your account.
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center border-t border-border pt-6 w-full">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or resend below.
            </p>
            <ResendVerificationForm defaultEmail={email} />
          </div>

          <Link
            href="/login"
            className="text-sm font-medium underline underline-offset-4 hover:text-primary"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
