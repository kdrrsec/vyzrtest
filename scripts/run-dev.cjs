/**
 * Force dev output into .next-dev before the Next binary loads next.config.
 * Prevents ./237.js-style missing chunks when dev and build would share .next.
 */
process.env.NEXT_USE_DEV_DIST = "1";

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

/** Pick up PORT from .env.local (Node does not load it before this script runs). */
function applyEnvLocalPort() {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    if (!fs.existsSync(envPath)) return;
    const text = fs.readFileSync(envPath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (key !== "PORT" && key !== "NEXT_DEV_PORT") continue;
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key === "PORT" && !process.env.PORT) process.env.PORT = val;
      if (key === "NEXT_DEV_PORT" && !process.env.NEXT_DEV_PORT) {
        process.env.NEXT_DEV_PORT = val;
      }
    }
  } catch (_) {
    /* ignore */
  }
}
applyEnvLocalPort();

/** Read SHOPIFY_DEV_INSECURE_TLS before Next boots (needed for image optimizer TLS on Windows). */
function applyEnvLocalTlsBypass() {
  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (!trimmed.startsWith("SHOPIFY_DEV_INSECURE_TLS=")) continue;
      const val = trimmed.slice("SHOPIFY_DEV_INSECURE_TLS=".length).trim();
      if (val === "1") process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      break;
    }
  } catch (_) {
    /* ignore */
  }
}
applyEnvLocalTlsBypass();

const nextBin = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next");
const passthrough = process.argv.slice(2);
/** Turbopack can break react-three-fiber/drei (ReactCurrentOwner). Default = webpack dev. */
const useTurbo = process.env.NEXT_DEV_TURBO === "1";
let nextArgs =
  passthrough.length > 0
    ? passthrough
    : useTurbo
      ? ["dev", "--turbo"]
      : ["dev"];

const devPort = process.env.PORT || process.env.NEXT_DEV_PORT || "3001";
const hasPortFlag =
  nextArgs.includes("-p") ||
  nextArgs.some((a) => a === "--port" || String(a).startsWith("--port="));
if (!hasPortFlag) {
  nextArgs = [...nextArgs, "-p", String(devPort)];
}

const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
  env: { ...process.env, NEXT_USE_DEV_DIST: "1" },
  windowsHide: true,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
