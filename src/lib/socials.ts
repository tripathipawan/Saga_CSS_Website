// Central social profile list — imported by the footer UI and the root
// JSON-LD `sameAs`. Keeping a single source of truth means adding a profile
// updates both places at once, and the a11y/SEO regression test can assert
// they stay in sync.
export type SocialProfile = { label: string; href: string };

export const SOCIAL_PROFILES: readonly SocialProfile[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pawantripathi/" },
  { label: "GitHub", href: "https://github.com/tripathipawan" },
  { label: "X (Twitter)", href: "https://x.com/pawantripathi04" },
  { label: "YouTube", href: "https://www.youtube.com/@tripathidevlab" },
  { label: "Instagram", href: "https://www.instagram.com/tripathidevlab" },
  {
    label: "WhatsApp Channel",
    href: "https://www.whatsapp.com/channel/0029Vb7sg2V3bbV4NpadBX1m",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Pawan-Tripathi/pfbid0jkY7FJJFu4r7gnVGo3JtTETbbKkKe2s7AArUwAMjdYF3ELxLpaL95CdT82vBsKKol/",
  },
] as const;

export const SOCIAL_HREFS = SOCIAL_PROFILES.map((s) => s.href);
