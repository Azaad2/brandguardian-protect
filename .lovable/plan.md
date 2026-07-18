# Lifecycle & Operational Emails

Build a lifecycle email engine on top of the existing daily-outreach infrastructure (Resend + Lovable AI + `pg_cron`) that guides every known contact to the next step in their BndBox journey.

## Audiences & journeys

1. **Resellers — signed up, not subscribed** → push to pick a plan.
2. **Resellers — subscribed but inactive** → surface new brands + pending application actions.
3. **Brand / Distributor Partner Hub applicants** → activation nudges (complete profile, verify, first login).
4. **Returning visitors (known email)** → warm re-engagement within hours of the return.

## Triggers

- **Dormant timers** at 7 / 14 / 30 days of inactivity (per audience, different message each stage).
- **Step-completion nudges** fired when a user finishes an action (signup, application submitted, first brand applied to, checkout started) → email describes the immediate next step.
- **Return-visit re-engagement** fired when a known email/user is seen on the site again after ≥3 days away.

## Content per email

- **New brands added since last email** (from `brands_directory.created_at`, filtered to the reseller's allocations when applicable).
- **Their pending applications / next best step** (from `brand_applications` + subscription state).
- **AI-generated industry insight** (Lovable AI Gateway, same pattern as `daily-outreach-emails`, one generation per audience per day to keep costs low).
- Every email ends with a single, audience-specific CTA + unsubscribe link (reuses `outreach-unsubscribe`).

## Data model

New tables (migration):

- `user_activity` — `user_id uuid null, email text, event_type text, occurred_at timestamptz default now(), metadata jsonb`. Indexed on `(email, occurred_at desc)`. Captures: `login`, `page_view`, `application_submitted`, `checkout_started`, `subscription_activated`, `return_visit`.
- `lifecycle_email_log` — `email text, journey text, stage text, sent_at timestamptz, resend_id text, unsubscribed_at timestamptz`. Unique on `(email, journey, stage)` so each stage fires at most once; global 3-day cooldown per email across all journeys.

Standard `GRANT` block (service_role full, authenticated read-own for `user_activity`), RLS on both, no anon.

## Tracking return visits

- Small client hook `useVisitTracker` posts to a new edge function `track-visit` on:
  - authenticated app load (uses `auth.uid()` + email),
  - anonymous load when an `bndbox_email` cookie exists (set when a known email submits any form — Partner Hub, lead magnet, contact, login).
- `track-visit` inserts a `page_view` row and, if the last prior activity was ≥3 days ago, also inserts a `return_visit` row that the lifecycle engine picks up.

## Sending engine

New edge function `lifecycle-emails` (scheduled + on-demand):

1. Pulls candidates for each journey/stage by joining `profiles` / `partner_applications` / `reseller_applications` / `brand_applications` / `subscribers` against `user_activity` and `lifecycle_email_log`.
2. Generates the AI insight block per audience once per run (cached in memory).
3. Renders one of 4 templates in `supabase/functions/_shared/email-templates/lifecycle-*.ts`:
   - `lifecycle-reseller-activation.ts` (not subscribed)
   - `lifecycle-reseller-winback.ts` (subscribed, inactive)
   - `lifecycle-partner-activation.ts` (brand/distributor applicant)
   - `lifecycle-return-visit.ts` (any known email who just came back)
4. Sends via Resend (`noreply@bndbox.com`), logs to `lifecycle_email_log`, respects `outreach-unsubscribe` blocks.
5. Hard cap: 100 lifecycle sends per run, 3-day per-recipient cooldown across all lifecycle journeys.

## Scheduling

`pg_cron` jobs (via `supabase--insert`, following the pattern already in the project):

- `lifecycle-emails-hourly` — every hour, processes return-visit journey (needs to react fast).
- `lifecycle-emails-daily` — 15:00 UTC, processes dormant + step-completion journeys.

## Step-completion nudges

Instead of DB triggers, existing edge functions that already fire on those events (e.g. Partner Hub submit, subscription checkout start, brand application submit) get a single added call to a new lightweight edge function `record-lifecycle-event` that writes to `user_activity`. The hourly cron then picks up any qualifying rows and sends the correct next-step email.

## Admin

- Add a "Lifecycle Emails" tab to the existing admin `EmailPreview` page to preview each of the 4 templates with sample data.
- Add a small stats card: sends today / opens (from `email_routing_logs` if webhooked) / unsubscribes.

## Out of scope

- No changes to the existing `daily-outreach-emails` job — it keeps running independently for cold outreach.
- No new payment logic.
- No new marketing/newsletter list — this is transactional lifecycle only.

## Files to add/change

- Migration: `user_activity`, `lifecycle_email_log`, indexes, GRANTs, RLS.
- Edge functions: `lifecycle-emails/`, `track-visit/`, `record-lifecycle-event/`.
- Templates: `supabase/functions/_shared/email-templates/lifecycle-*.ts` (4 files).
- Frontend: `src/hooks/useVisitTracker.ts`, mounted once in `App.tsx`; small cookie helper in `src/utils/`.
- Hooks into existing submit flows: Partner Hub submission, reseller signup, subscription checkout, brand application submit → call `record-lifecycle-event`.
- Admin preview additions in `src/pages/admin/EmailPreview.tsx`.
- `pg_cron` schedule via `supabase--insert`.
