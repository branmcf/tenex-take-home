"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleNotch } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendVerificationEmail } from "@/lib/auth-client";
import {
  handleAndShowError,
  processBetterAuthResult,
  showSuccessToast,
} from "@/lib/errors";

const resendSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
});

type ResendFormData = z.infer<typeof resendSchema>;

interface ResendVerificationFormProps {
  defaultEmail?: string;
}

export function ResendVerificationForm({ defaultEmail }: ResendVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  });

  const onSubmit = async (data: ResendFormData) => {
    setIsLoading(true);

    try {
      const result = await sendVerificationEmail({
        email: data.email,
        callbackURL: "/email-verified",
      });

      const error = processBetterAuthResult(result, {
        action: "resend_verification",
        email: data.email,
      });

      if (error) {
        return;
      }

      setSent(true);
      showSuccessToast(
        "Verification email sent!",
        "Please check your inbox and spam folder."
      );
    } catch (err) {
      handleAndShowError(err, {
        action: "resend_verification",
        email: data.email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm text-primary font-medium">
          Verification email sent!
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full max-w-xs">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          aria-invalid={!!errors.email}
          className="text-sm"
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? (
            <CircleNotch className="size-4 animate-spin" />
          ) : (
            "Resend"
          )}
        </Button>
      </div>
      {errors.email && (
        <p className="text-xs text-destructive">{errors.email.message}</p>
      )}
    </form>
  );
}
