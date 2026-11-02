import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginBackground } from "@/components/auth/LoginBackground";
import { AuthBrandHeader } from "@/components/auth/AuthBrandHeader";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <LoginBackground />
      <main className="auth-light relative z-10 flex min-h-screen items-center justify-center px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-sm space-y-5">
          <AuthBrandHeader headingKey="auth.forgotPassword" />
          <div className="space-y-4 rounded-[1.35rem] border border-[rgba(15,23,42,0.10)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
            <Suspense>
              <ForgotPasswordForm />
            </Suspense>
          </div>
          <p className="text-center text-xs text-[#475569]">
            <a href="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">← Back to sign in</a>
          </p>
        </div>
      </main>
    </>
  );
}
