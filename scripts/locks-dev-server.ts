/**
 * npm run locks:dev
 *
 * A tiny helper for /admin/locks/ during local development only. It lets the page's
 * "Save to project" button write src/content/locks.json. Never part of the build or deploy.
 *
 * - Listens on 127.0.0.1:4319 only (not reachable from other machines).
 * - CORS limited to http://localhost:3000 (and 127.0.0.1:3000).
 * - GET /health → { ok: true }
 * - POST /locks { lockedMessage, locked[] } → validates every slug, then writes the file.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { resources } from "../src/content/resources";
import { LOCKS_PATH } from "../src/lib/resourcePaths";

const HOST = "127.0.0.1";
const PORT = 4319;
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const MAX_BODY = 64 * 1024;
const slugs = resources.map((r) => r.slug);

type LocksFile = { lockedMessage: string; locked: string[] };

function validate(
  body: unknown,
): { ok: true; value: LocksFile } | { ok: false; error: string } {
  if (!body || typeof body !== "object")
    return { ok: false, error: "Body must be a JSON object." };
  const { lockedMessage, locked } = body as Record<string, unknown>;
  if (
    typeof lockedMessage !== "string" ||
    !lockedMessage.trim() ||
    lockedMessage.length > 200
  )
    return { ok: false, error: "lockedMessage must be 1–200 characters." };
  if (!Array.isArray(locked) || !locked.every((s) => typeof s === "string"))
    return { ok: false, error: "locked must be an array of resource slugs." };
  const unknown = locked.filter((s) => !slugs.includes(s));
  if (unknown.length)
    return {
      ok: false,
      error: `Unknown resource slug(s): ${unknown.join(", ")}`,
    };
  // De-duplicate and keep the order resources are listed in.
  const set = new Set(locked as string[]);
  return {
    ok: true,
    value: {
      lockedMessage: lockedMessage.trim(),
      locked: slugs.filter((s) => set.has(s)),
    },
  };
}

function send(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  const allowed = !!origin && ALLOWED_ORIGINS.has(origin);
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Chrome's Private Network Access preflight.
    if (req.headers["access-control-request-private-network"]) {
      res.setHeader("Access-Control-Allow-Private-Network", "true");
    }
  }

  if (req.method === "OPTIONS") {
    res.writeHead(allowed ? 204 : 403);
    return res.end();
  }
  if (req.method === "GET" && req.url === "/health")
    return send(res, 200, { ok: true });

  if (req.method === "POST" && req.url === "/locks") {
    if (!allowed) return send(res, 403, { error: "Origin not allowed." });
    let raw = "";
    let tooBig = false;
    req.on("data", (chunk: Buffer) => {
      raw += chunk;
      if (raw.length > MAX_BODY) {
        tooBig = true;
        req.destroy();
      }
    });
    req.on("end", () => {
      if (tooBig) return;
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return send(res, 400, { error: "Body isn't valid JSON." });
      }
      const result = validate(parsed);
      if (!result.ok) return send(res, 400, { error: result.error });
      fs.writeFileSync(
        path.resolve(LOCKS_PATH),
        `${JSON.stringify(result.value, null, 2)}\n`,
      );
      console.log(
        `✓ Wrote ${LOCKS_PATH}: ${result.value.locked.length} locked.`,
      );
      send(res, 200, { ok: true, ...result.value });
    });
    return;
  }

  send(res, 404, { error: "Not found." });
});

server.listen(PORT, HOST, () => {
  console.log(`Lock helper listening on http://${HOST}:${PORT} (local only).`);
  console.log(
    `Open http://localhost:3000/admin/locks/ and use "Save to project". Ctrl+C to stop.`,
  );
});
