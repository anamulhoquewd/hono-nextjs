"use client";

import { ForgotPasswordForm } from "@/app/_components/auth/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-60 flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password ?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&rsquo;ll send you a link to reset
            your password.
          </p>
        </div>
        <ForgotPasswordForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            If you remember your password{" "}
            <Link
              href="/auth/log-in"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
