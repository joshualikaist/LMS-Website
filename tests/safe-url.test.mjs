import assert from "node:assert/strict";
import { test } from "node:test";
import { safeHttpsUrl } from "../content/digest/safe-url.mjs";

test("accepts plain https links and returns the normalized href", () => {
  assert.equal(safeHttpsUrl("https://example.com/a?b=1#c"), "https://example.com/a?b=1#c");
  assert.equal(safeHttpsUrl("  https://news.ycombinator.com/item?id=1  "), "https://news.ycombinator.com/item?id=1");
  assert.equal(safeHttpsUrl("https://example.com:443/x"), "https://example.com/x");
  assert.equal(safeHttpsUrl("https://bücher.example/pfad"), "https://xn--bcher-kva.example/pfad");
});

test("upgrades http to https", () => {
  assert.equal(safeHttpsUrl("http://www.bbc.co.uk/news/1"), "https://www.bbc.co.uk/news/1");
});

test("rejects dangerous or non-web schemes", () => {
  for (const value of [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "ftp://example.com/x",
    "mailto:a@b.com",
    "blob:https://example.com/uuid",
    "about:blank",
  ]) {
    assert.equal(safeHttpsUrl(value), null, value);
  }
});

test("rejects relative, protocol-relative, malformed and non-string input", () => {
  for (const value of ["/relative", "relative/path", "//evil.example/x", "https://", "http:///x", "", "   ", null, undefined, 42, {}, []]) {
    assert.equal(safeHttpsUrl(value), null, String(value));
  }
});

test("rejects credentials, odd ports, and local or private hosts", () => {
  for (const value of [
    "https://user:pass@example.com/",
    "https://user@example.com/",
    "https://example.com:8443/",
    "https://example.com:80/",
    "https://localhost/x",
    "https://app.localhost/x",
    "https://printer.local/x",
    "https://db.internal/x",
    "https://intranet/x",
    "https://127.0.0.1/x",
    "https://10.0.0.5/x",
    "https://192.168.1.1/x",
    "https://172.16.0.1/x",
    "https://169.254.169.254/latest/meta-data",
    "https://[::1]/x",
  ]) {
    assert.equal(safeHttpsUrl(value), null, value);
  }
});

test("rejects whitespace, control characters, and oversized values", () => {
  assert.equal(safeHttpsUrl("https://example.com/a b"), null);
  assert.equal(safeHttpsUrl("https://example.com/\nonclick=alert(1)"), null);
  assert.equal(safeHttpsUrl("https://example.com/\u0000"), null);
  assert.equal(safeHttpsUrl("https://example.com/a b"), null);
  assert.equal(safeHttpsUrl("https://example.com/a b"), null);
  // Surrounding whitespace (including U+2028) is trimmed, not rejected.
  assert.equal(safeHttpsUrl(" https://example.com/ "), "https://example.com/");
  assert.equal(safeHttpsUrl(`https://example.com/${"a".repeat(2100)}`), null);
});
