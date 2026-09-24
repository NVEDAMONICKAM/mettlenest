/**
 * Prefix a public file path (images, downloads, form actions) with the deploy base path.
 *
 * Do NOT use this for `next/link` hrefs or `router.push`: Next adds basePath to those itself,
 * so wrapping them would double the prefix.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path; // absolute URL, mailto:, etc.
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${clean}`;
}
