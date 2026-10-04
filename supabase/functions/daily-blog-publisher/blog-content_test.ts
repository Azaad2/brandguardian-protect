import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { estimateReadTime, sanitizeGeneratedHtml } from "../_shared/blog-content.ts";

Deno.test("sanitizes executable HTML", () => {
  const sanitized = sanitizeGeneratedHtml('<p onclick="alert(1)">Useful</p><script>alert(1)</script>');
  assert(!sanitized.includes("onclick"));
  assert(!sanitized.includes("script"));
});

Deno.test("estimates a readable duration", () => {
  assertEquals(estimateReadTime(1100), "5 min read");
});