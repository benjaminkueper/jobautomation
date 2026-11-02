import Link from "next/link";

/** Shown on sign-in / sign-up — required for Google OAuth consent and verification. */
export function AuthLegalNotice() {
  return (
    <p className="text-center text-xs leading-relaxed text-[#475569]">
      By continuing, you agree to our{" "}
      <Link href="/terms" className="font-semibold text-[#2563EB] underline-offset-2 hover:text-[#1D4ED8] hover:underline">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="font-semibold text-[#2563EB] underline-offset-2 hover:text-[#1D4ED8] hover:underline">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
