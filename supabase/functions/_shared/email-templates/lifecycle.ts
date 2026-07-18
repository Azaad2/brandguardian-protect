// Shared HTML wrapper for all lifecycle emails
function shell(opts: {
  preheader: string;
  heading: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  unsubUrl: string;
  footerNote?: string;
}): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${opts.heading}</title></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827;">
<span style="display:none;max-height:0;overflow:hidden;color:transparent;">${opts.preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,0.06);">
      <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px 32px;color:#fff;">
        <div style="font-size:20px;font-weight:700;letter-spacing:.3px;">BndBox</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#0f172a;">${opts.heading}</h1>
        <div style="font-size:15px;line-height:1.6;color:#334155;">${opts.bodyHtml}</div>
        <div style="text-align:center;margin:28px 0 8px;">
          <a href="${opts.ctaUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">${opts.ctaLabel}</a>
        </div>
        ${opts.footerNote ? `<p style="font-size:13px;color:#64748b;margin-top:24px;">${opts.footerNote}</p>` : ""}
      </td></tr>
      <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;text-align:center;">
        BndBox &middot; NJ, United States<br>
        <a href="${opts.unsubUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

const APP = "https://bndbox.com";

export function resellerActivationEmail(name: string, stage: string, insightHtml: string, newBrandsHtml: string, unsubUrl: string): string {
  const heading = stage === "day7"
    ? `${name || "Hey"}, unlock brand approvals in one click`
    : stage === "day14"
    ? `${name || "Quick reminder"} — your BndBox account is ready to go`
    : `Last chance to activate your BndBox reseller access`;

  const body = `
    <p>You created a BndBox reseller account but haven't picked a plan yet. Your account is ready — you just need to activate a subscription to start applying to brands and getting ungated.</p>
    ${insightHtml}
    ${newBrandsHtml}
    <p><strong>What you get on any paid plan:</strong></p>
    <ul>
      <li>Instant applications to verified brands</li>
      <li>Auto-tracked approvals and follow-ups</li>
      <li>Direct messaging with brand reps</li>
    </ul>`;
  return shell({
    preheader: "Pick a plan and start applying to brands today",
    heading, bodyHtml: body,
    ctaLabel: "Choose your plan",
    ctaUrl: `${APP}/reseller-hub/subscription`,
    unsubUrl,
  });
}

export function resellerWinbackEmail(name: string, stage: string, insightHtml: string, newBrandsHtml: string, pendingHtml: string, unsubUrl: string): string {
  const heading = `${name || "Welcome back"} — here's what you missed on BndBox`;
  const body = `
    <p>We noticed you haven't logged in for a while. Your subscription is active and there's new activity waiting for you.</p>
    ${pendingHtml}
    ${newBrandsHtml}
    ${insightHtml}`;
  return shell({
    preheader: "New brands, pending replies, and next steps inside",
    heading, bodyHtml: body,
    ctaLabel: "Open my dashboard",
    ctaUrl: `${APP}/reseller-hub`,
    unsubUrl,
    footerNote: `Stage: ${stage}`,
  });
}

export function partnerActivationEmail(name: string, partnerType: string, stage: string, insightHtml: string, unsubUrl: string): string {
  const label = partnerType === "distributor" ? "Distributor" : partnerType === "wholesaler" ? "Wholesaler" : partnerType === "retailer" ? "Retailer" : "Brand";
  const heading = stage === "day7"
    ? `${name || "Hello"} — your ${label} application on BndBox`
    : `${name || "Hello"} — complete your ${label} setup`;
  const body = `
    <p>Thanks for applying to the BndBox Partner Hub as a <strong>${label}</strong>. Your application is being reviewed, and there are a few things you can do right now to get matched faster:</p>
    <ul>
      <li>Confirm your contact email (reply to this message)</li>
      <li>Share your product categories and geographies</li>
      <li>Explore the network of partners already on BndBox</li>
    </ul>
    ${insightHtml}`;
  return shell({
    preheader: "A few quick steps unlock your matches faster",
    heading, bodyHtml: body,
    ctaLabel: "Visit Partner Hub",
    ctaUrl: `${APP}/partner-hub?type=${partnerType}`,
    unsubUrl,
  });
}

export function returnVisitEmail(name: string, insightHtml: string, newBrandsHtml: string, unsubUrl: string): string {
  const heading = `${name || "Welcome back"} — pick up where you left off`;
  const body = `
    <p>Good to see you back on BndBox. Here's what's new since your last visit:</p>
    ${newBrandsHtml}
    ${insightHtml}
    <p>Jump back in and take the next step — one action today keeps your pipeline moving.</p>`;
  return shell({
    preheader: "You just visited BndBox — here's what changed",
    heading, bodyHtml: body,
    ctaLabel: "Continue on BndBox",
    ctaUrl: `${APP}/reseller-hub`,
    unsubUrl,
  });
}
