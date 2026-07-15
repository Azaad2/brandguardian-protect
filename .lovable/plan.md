
## Goal
Every day, send up to 50 emails (30-day cooldown per recipient) to contacts already in the database — brands, distributors, and resellers who came through Partner Hub — with AI-generated industry/BndBox ecosystem content. Each audience gets a distinct email; all point back to BndBox with the right CTA.

## Audiences & sources
- **Brands** → `brands_directory.contact_email` (only `is_active = true`). CTA: Join Partner Hub as Brand → `/partner-hub?type=brand`
- **Distributors** → `distributors.contact_email`. CTA: Join Partner Hub as Distributor → `/partner-hub?type=distributor`
- **Resellers via Partner Hub** → `partner_applications` where `partner_type = 'reseller'` (plus `reseller_applications.email` as fallback). CTA: Access Reseller Hub → `/reseller-hub`

## Deduping & throttling
- New table `daily_outreach_log` (email, audience_type, sent_at, subject, campaign_date) with unique index on `(email, audience_type)` for fast 30-day lookups.
- Reuse existing `brand_engagement_emails` table only for tracking; the new log is the single source of truth for cooldown.
- Each daily run: pick up to 50 eligible recipients, split across the 3 audiences (round-robin, e.g. ~17/17/16), skip anyone emailed in the last 30 days.

## Content generation
- One edge function `daily-outreach-emails` (scheduled) that:
  1. Selects the day's audience mix.
  2. Calls Lovable AI Gateway once per audience to produce that day's talking points: BndBox ecosystem explainer, who it helps, notable brands already joined (top N from `brands_directory`), and current industry news framing.
  3. Renders 3 audience-specific HTML templates in `supabase/functions/_shared/email-templates/`:
     - `daily-brand-outreach.ts`
     - `daily-distributor-outreach.ts`
     - `daily-reseller-outreach.ts`
  4. Sends via existing Resend HTTP flow (from `noreply@bndbox.com`) with unsubscribe footer linking to a simple opt-out endpoint.
  5. Logs each send into `daily_outreach_log`.

## Scheduling
- `pg_cron` job runs the edge function daily at 14:00 UTC via `net.http_post`.

## Admin preview
- Small admin page/button reusing `EmailPreview` pattern to preview each of the 3 templates with sample AI content before it goes live.

## Opt-out
- Edge function `outreach-unsubscribe` marks the email in `daily_outreach_log` with `unsubscribed_at`; future runs exclude any address that has an unsubscribe record.

## Technical details
- Migration: create `daily_outreach_log`, GRANTs, RLS (admin read only, service_role all), indexes on `(email, audience_type)` and `sent_at`.
- Reuse Resend key already in secrets; no new secrets required.
- AI model: Lovable AI Gateway using a current supported chat model (picked at implementation time from `ai-models-chat`).
- All queries filter out null/empty emails and known bounced addresses (if `email_routing_logs` shows a hard bounce).

## Out of scope
- No changes to existing brand_engagement 30-day cooldown flow.
- No paid promotional content — informational + CTA only.
