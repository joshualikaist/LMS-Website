// Policy for links that arrive from third-party feeds (HN, RSS, dev.to, ...).
// Shared by the collector (scripts/fetch-digest.mjs), the page loader
// (content/digest/load.ts), and the tests, so the rule lives in one place.
//
// A link is accepted only if it is a plain https URL:
//   - http:// is upgraded to https:// (every current edition is already https)
//   - any other scheme (javascript:, data:, file:, ...) is rejected
//   - credentials (user:pass@), non-default ports, and local/private hosts are rejected
//   - whitespace/control characters and very long values are rejected

const MAX_LENGTH = 2048;
const CONTROL_OR_SPACE = new RegExp("[\u0000-\u0020\u007f-\u009f\u2028\u2029]");
const PRIVATE_IPV4 = /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/;

function isLocalHost(hostname) {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.includes(":") || // IPv6 literal
    PRIVATE_IPV4.test(host) ||
    !host.includes(".")
  );
}

/** Returns the normalized https URL, or null when the value is not safe to link to. */
export function safeHttpsUrl(input) {
  if (typeof input !== "string") return null;
  const value = input.trim();
  if (!value || value.length > MAX_LENGTH || CONTROL_OR_SPACE.test(value)) return null;

  let url;
  try {
    url = new URL(value);
  } catch {
    return null; // relative or malformed
  }

  if (url.protocol === "http:") url.protocol = "https:";
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "443") return null;
  if (!url.hostname || isLocalHost(url.hostname)) return null;

  return url.href;
}
