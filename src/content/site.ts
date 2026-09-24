export const siteName = "MettleNest";
export const siteTagline = "Behaviour Coaching & Educational Training";
export const siteDescription =
  "Behaviour coaching and educational training for families, educators and schools. Understand the behaviour, connect with the child, watch them grow.";

export const founderName = "Jemimah Vedamonickam";

export const enquiryEmail = "hello@mettlenest.com";
export const enquiryMailto = `mailto:${enquiryEmail}?subject=${encodeURIComponent("BRIDGE Alignment Session enquiry")}`;

// Used for the sitemap, robots.txt and Open Graph URLs. Set NEXT_PUBLIC_SITE_URL when deploying.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mettlenest.com.au"
).replace(/\/$/, "");

export type NavItem = { href: string; label: string; star?: boolean };

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/bridge/", label: "BRIDGE", star: true },
  { href: "/resources/", label: "Resources" },
  { href: "/quick-links/", label: "Quick links" },
];
