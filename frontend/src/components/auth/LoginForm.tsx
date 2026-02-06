"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleNotch, EnvelopeSimple } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth-client";
import {
  handleAndShowError,
  processBetterAuthResult,
} from "@/lib/errors";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Required")
    .email("Invalid email"),
  password: z.string().min(1, "Required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setNeedsVerification(false);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      // Check for email not verified specifically
      if (result.error?.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerification(true);
        return;
      }

      // Check for other Better Auth errors
      const error = processBetterAuthResult(result, {
        action: "login",
        email: data.email,
      });

      if (error) {
        return;
      }

      // Success - redirect to home
      router.push("/");
    } catch (err) {
      handleAndShowError(err, {
        action: "login",
        email: data.email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Login</h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
          Enter your credentials to continue
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="off"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="off"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {needsVerification && (
          <div className="flex items-start gap-3 rounded-md border border-border bg-muted/50 p-4">
            <EnvelopeSimple className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-medium">Email not verified</p>
              <p className="text-muted-foreground">
                Please verify your email before signing in.{" "}
                <Link
                  href={`/verify-email?email=${encodeURIComponent(getValues("email"))}`}
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  Resend verification email
                </Link>
              </p>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <CircleNotch className="size-4 animate-spin" />}
          Login
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <GoogleAuthButton />
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
