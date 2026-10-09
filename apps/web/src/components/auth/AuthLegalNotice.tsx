import Link from "next/link";

/** Shown on sign-in / sign-up — required for Google OAuth consent and verification. */
export function AuthLegalNotice() {
  return (
    <p className="text-center text-xs leading-relaxed text-zinc-400">
      By continuing, you agree to our{" "}
      <Link href="/terms" className="font-medium text-white underline-offset-2 hover:underline">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="font-medium text-white underline-offset-2 hover:underline">
        Privacy Policy
      </Link>
      .
    </p>
  );
}