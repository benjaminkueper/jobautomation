/**
 * Unipile connectivity check.
 * Verifies the configured UNIPILE_DSN / UNIPILE_API_KEY against the Unipile REST API,
 * then probes the local API health + folders for the connected tenant.
 *
 * Run: pnpm exec dotenv -e .env -- tsx scripts/unipile-check.ts
 */
const DSN = (process.env.UNIPILE_DSN ?? "").trim().replace(/\/+$/, "");
const API_KEY = (process.env.UNIPILE_API_KEY ?? "").trim();
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const TENANT = process.env.DEMO_TENANT_ID ?? "demo-tenant-id";
const USER = process.env.DEMO_USER_ID ?? "demo-user-id";
const AUTH_TOKEN = process.env.SMOKE_AUTH_TOKEN ?? process.env.JOBFLOW_ACCESS_TOKEN ?? "";

type Result = { name: string; ok: boolean; detail?: string };

function authHeaders(): Record<string, string> {
  if (AUTH_TOKEN) return { Authorization: `Bearer ${AUTH_TOKEN}`, "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    "x-tenant-id": TENANT,
    "x-user-id": USER,
    "x-user-role": "Owner",
  };
}

async function unipileRaw(path: string): Promise<Response> {
  return fetch(`${DSN}${path}`, {
    headers: { "X-API-KEY": API_KEY, Accept: "application/json" },
    cache: "no-store",
  });
}

async function main() {
  const results: Result[] = [];

  if (!DSN || !API_KEY) {
    console.error("Missing UNIPILE_DSN or UNIPILE_API_KEY in the environment (.env).");
    process.exit(1);
  }

  console.log(`Unipile DSN: ${DSN}`);
  console.log(`API key: ${API_KEY.slice(0, 8)}…(${API_KEY.length} chars)\n`);

  try {
    const res = await unipileRaw("/api/v1/accounts?limit=5");
    const text = await res.text();
    results.push({
      name: `GET ${DSN}/api/v1/accounts`,
      ok: res.ok,
      detail: res.ok ? text.slice(0, 400) : `HTTP ${res.status} — ${text.slice(0, 300)}`,
    });
  } catch (e) {
    results.push({
      name: `GET ${DSN}/api/v1/accounts`,
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  async function localGet(path: string, name: string, bodyOkField = false) {
    try {
      const res = await fetch(`${API_URL}${path}`, { headers: authHeaders(), cache: "no-store" });
      const text = await res.text();
      let ok = res.ok;
      if (bodyOkField && res.ok) {
        try {
          const json = JSON.parse(text) as { data?: { ok?: boolean } };
          ok = json.data?.ok === true;
        } catch {
          ok = false;
        }
      }
      results.push({
        name,
        ok,
        detail: res.ok ? text.slice(0, 400) : `HTTP ${res.status} — ${text.slice(0, 300)}`,
      });
    } catch (e) {
      results.push({ name, ok: false, detail: e instanceof Error ? e.message : String(e) });
    }
  }

  await localGet("/integrations/unipile/health", `LOCAL ${API_URL}/integrations/unipile/health`, true);
  await localGet("/integrations/unipile/folders", `LOCAL ${API_URL}/integrations/unipile/folders`);

  const passed = results.filter((r) => r.ok).length;
  console.log(`\nUnipile check — ${passed}/${results.length} passed\n`);
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? `\n    ${r.detail}` : ""}`);
  }

  if (results.some((r) => !r.ok)) {
    console.error("\nUnipile credentials are rejected or the local API is not reachable.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
