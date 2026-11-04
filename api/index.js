// Vercel serverless entry. vercel.json rewrites /api/* (and /custom/*) here as
// /api/index?qtpath=<original path>; restore the original URL, then reuse the local server's handler.
import { handleServerless } from "../server.js";

export default function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const original = url.searchParams.get("qtpath");
  if (original) {
    url.searchParams.delete("qtpath");
    const rest = url.searchParams.toString();
    req.url = original + (rest ? `?${rest}` : "");
  }
  return handleServerless(req, res);
}
