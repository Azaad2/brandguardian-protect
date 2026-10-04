# Project Architecture Rules

- Treat `/reseller/dashboard/*` as the canonical reseller portal path and retain redirects for legacy `/reseller-portal/*` links so old emails and bookmarks remain valid.
- Store automated articles in `public.blog_posts` and render them through the dynamic blog route; keep legacy article routes intact for stable SEO URLs.
- Run daily article generation only through the bounded `daily-blog-publisher` job with database locking, one-per-day idempotency, and persistent pause states.