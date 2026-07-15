// Shared daily outreach email templates for brands, distributors, and resellers.
// AI-generated body content is injected into the middle section.

const APP_URL = "https://bndbox.com";

function baseWrapper(opts: {
  headline: string;
  intro: string;
  aiBodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  unsubscribeUrl: string;
  footerNote: string;
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${opts.headline}</title></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f7fa;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:32px 30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:28px;">BndBox</h1>
      <p style="color:#e0e7ff;margin:8px 0 0 0;font-size:14px;">The Wholesale Distribution Network</p>
    </div>
    <div style="padding:36px 30px 8px 30px;">
      <h2 style="color:#111827;margin:0 0 12px 0;font-size:22px;">${opts.headline}</h2>
      <p style="color:#374151;line-height:1.6;margin:0 0 20px 0;font-size:15px;">${opts.intro}</p>
    </div>
    <div style="padding:0 30px 20px 30px;color:#374151;line-height:1.7;font-size:15px;">
      ${opts.aiBodyHtml}
    </div>
    <div style="padding:20px 30px 40px 30px;text-align:center;">
      <a href="${opts.ctaUrl}" style="background:#4f46e5;color:#fff;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">${opts.ctaLabel}</a>
      ${opts.secondaryLabel && opts.secondaryUrl ? `<div style="margin-top:14px;"><a href="${opts.secondaryUrl}" style="color:#4f46e5;text-decoration:none;font-size:14px;">${opts.secondaryLabel} →</a></div>` : ""}
    </div>
    <div style="padding:24px 30px;background:#f9fafb;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#6b7280;font-size:12px;margin:0 0 8px 0;">${opts.footerNote}</p>
      <p style="color:#9ca3af;font-size:11px;margin:0;">© 2026 BndBox · NJ, United States · <a href="${opts.unsubscribeUrl}" style="color:#6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body></html>`;
}

export function brandOutreachEmail(recipientName: string, aiBodyHtml: string, unsubscribeUrl: string) {
  return baseWrapper({
    headline: `${recipientName ? recipientName + ", grow" : "Grow"} your brand with verified buyers`,
    intro: "BndBox connects brands like yours to a pre-vetted network of retailers, distributors, and marketplace resellers — one platform, every channel.",
    aiBodyHtml,
    ctaLabel: "Join BndBox as a Brand",
    ctaUrl: `${APP_URL}/partner-hub?type=brand`,
    secondaryLabel: "See how it works",
    secondaryUrl: `${APP_URL}/`,
    unsubscribeUrl,
    footerNote: "You're receiving this because your brand is listed in our directory of industry brands.",
  });
}

export function distributorOutreachEmail(recipientName: string, aiBodyHtml: string, unsubscribeUrl: string) {
  return baseWrapper({
    headline: `${recipientName ? recipientName + " — access" : "Access"} new brands & retailer demand`,
    intro: "BndBox is where distributors and wholesalers discover new brands to carry and connect with qualified retail and reseller buyers.",
    aiBodyHtml,
    ctaLabel: "Join BndBox as a Distributor",
    ctaUrl: `${APP_URL}/partner-hub?type=distributor`,
    secondaryLabel: "Browse the network",
    secondaryUrl: `${APP_URL}/`,
    unsubscribeUrl,
    footerNote: "You're receiving this because your company is listed in our distributor directory.",
  });
}

export function resellerOutreachEmail(recipientName: string, aiBodyHtml: string, unsubscribeUrl: string) {
  return baseWrapper({
    headline: `${recipientName ? recipientName + ", unlock" : "Unlock"} more brands to sell`,
    intro: "BndBox helps resellers get ungated, source directly from verified brands, and grow revenue across Amazon, Walmart, eBay, and beyond.",
    aiBodyHtml,
    ctaLabel: "Open Reseller Hub",
    ctaUrl: `${APP_URL}/reseller-hub`,
    secondaryLabel: "Browse partner programs",
    secondaryUrl: `${APP_URL}/partner-hub?type=reseller`,
    unsubscribeUrl,
    footerNote: "You're receiving this because you applied through BndBox Partner Hub.",
  });
}
