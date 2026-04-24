"use strict";

const fs = require("fs");
const path = require("path");
const DEFAULT_BACKEND_URL = "https://enquadra-pcd-saas.onrender.com";

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

const backendUrl = normalizeUrl(
  process.env.NETLIFY_BACKEND_URL
  || process.env.DAVICORE_BACKEND_URL
  || process.env.BACKEND_URL
  || DEFAULT_BACKEND_URL
);

const usedFallback = !normalizeUrl(
  process.env.NETLIFY_BACKEND_URL
  || process.env.DAVICORE_BACKEND_URL
  || process.env.BACKEND_URL
);

if (usedFallback) {
  console.warn(`[netlify] NETLIFY_BACKEND_URL nao foi definido. Usando fallback: ${backendUrl}`);
}

const rules = [];

if (backendUrl) {
  rules.push(`/api/*  ${backendUrl}/api/:splat  200`);
  rules.push(`/health  ${backendUrl}/health  200`);
}

rules.push("/*  /index.html  200");

const redirectsPath = path.join(process.cwd(), "_redirects");
fs.writeFileSync(redirectsPath, `${rules.join("\n")}\n`, "utf8");

console.log(`[netlify] _redirects gerado em ${redirectsPath}`);
if (backendUrl) {
  console.log(`[netlify] Proxy /api configurado para ${backendUrl}`);
} else {
  console.log("[netlify] Build local sem proxy externo configurado.");
}
