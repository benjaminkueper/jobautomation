import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginBackground } from "@/components/auth/LoginBackground";
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <>
      <LoginBackground />
      <main className="auth-light relative z-10 flex min-h-screen items-center justify-center px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-sm space-y-5">
          <AuthBrandHeader headingKey="auth.resetPassword" />
          <div className="space-y-4 rounded-[1.35rem] border border-[rgba(15,23,42,0.10)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
