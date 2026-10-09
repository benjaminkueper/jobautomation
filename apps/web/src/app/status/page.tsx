import type { Metadata } from "next";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";
import { PublicStatusClient } from "@/components/system/PublicStatusClient";

export const metadata: Metadata = {
  title: "Status Page",
  description: "Live operational status of NewJob Guru services — API, database, and automation workers.",
  alternates: { canonical: "https://www.newjob.guru/status" },
};

export default function StatusPage() {
  return (
    <PublicPageShell
      eyebrow="Status"
      title="System Status"
      subtitle="Current operational status of NewJob Guru services, updated live."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Status", href: "/status" }]}
    >
      <PublicStatusClient />
    </PublicPageShell>
  );
}
