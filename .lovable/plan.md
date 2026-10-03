# Daily SEO Blog Publishing

## Goal
Publish one useful, plain-English BndBox article every day for a balanced audience of resellers, brands, distributors, wholesalers, and retailers.

## What will be built
- Add a database-backed blog so new articles can appear without changing the website code.
- Preserve every existing hand-written article and URL while adding a dynamic article page for newly published posts.
- Add a daily publishing job that:
  1. selects a fresh topic from researched keyword opportunities and existing content gaps,
  2. checks that the topic is not duplicated,
  3. writes one complete article in plain English,
  4. validates title, slug, summary, headings, factual language, links, and minimum content quality,
  5. automatically publishes only when all checks pass.
- Rotate the intended reader so coverage stays balanced across the BndBox marketplace.
- Show new posts in the Blog listing with correct metadata and article structured data.
- Add operational controls for pause/resume, single-flight execution, daily limits, durable run history, and failure reasons.

## Keyword workflow
- Seed the first topic queue with current US keyword and competitor research relevant to BndBox.
- Refresh topic opportunities daily using content gaps, search intent, prior article performance signals available to the app, and the approved BndBox subject areas.
- Never invent search volume or claim current news without a verifiable source.
- Avoid duplicate and near-duplicate topics already published or queued.

## Publishing safeguards
- Maximum: one published article per calendar day.
- Automatic publishing is blocked when generation is incomplete, duplicated, malformed, or fails validation.
- AI credit, policy, access, or rate-limit failures pause the job according to the platform’s recovery rules rather than publishing fallback filler.
- Each run is idempotent and protected against simultaneous duplicate runs.
- The owner can pause automation and inspect article/run status.

## Technical details
- Create public blog-post, topic-queue, and automation-state tables with explicit grants and row-level access rules.
- Implement a scheduled Supabase function using the Lovable AI Gateway and `openai/gpt-6-astra` through the Responses API.
- Schedule one daily callback through the project’s existing Supabase scheduling pattern.
- Add `/blog/:slug`, shared article rendering, loading/error states, and public queries for published posts.
- Merge dynamic posts into Blog schema and article discovery while retaining legacy routes.
- Record the new database-backed blog and scheduler ownership rules in the project architecture notes.

## Verification
- Test topic deduplication, one-per-day enforcement, lock behavior, pause behavior, validation failures, and successful publication.
- Verify the Blog page and a generated article at desktop and mobile sizes.
- Confirm the scheduled function’s live response and current build health.
