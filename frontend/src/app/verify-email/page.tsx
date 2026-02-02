import Link from "next/link";
import { Stack, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Stack className="size-4" weight="bold" />
            </div>
            B-Plex
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 pb-12">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <EnvelopeSimple className="size-8 text-muted-foreground" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-muted-foreground">
              We&apos;ve sent you a verification link to your email address.
              Please click the link to verify your account.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Didn&apos;t receive the email?</p>
            <p>Check your spam folder or try signing up again.</p>
          </div>

          <Link
            href="/login"
            className="text-sm underline underline-offset-4 hover:text-foreground"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
