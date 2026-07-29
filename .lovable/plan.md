## BndBox AI Chat Assistant (floating popup)

A Lusha-style chat bubble in the bottom-right of every public page. Visitors open it and ask anything about BndBox — how reseller approvals work, what brands are available, pricing, who can join, how to apply — and get answers from an AI assistant that knows the product and can look up real data.

### What the visitor sees

```text
                          ┌──────────────────────────┐
                          │  BndBox Assistant     ✕  │
                          ├──────────────────────────┤
                          │  Hi 👋 Ask me anything   │
                          │  about wholesale on      │
                          │  BndBox.                 │
                          │                          │
                          │  [How do I get ungated?] │
                          │  [Which brands?        ] │
                          │  [Pricing             ]  │
                          ├──────────────────────────┤
                          │ Ask a question…      [→] │
                          │ Talk to a human          │
                          └──────────────────────────┘
                                        ( 💬 )
```

- Floating launcher button, unread-style pulse on first visit.
- One ongoing conversation per visitor (no thread list), with a "New conversation" reset.
- Suggested starter questions on the empty state.
- Streaming replies with a "Thinking…" shimmer, markdown rendering.
- "Talk to a human" opens a compact name/email/message form that files into your existing contact/lead flow.

### What the assistant knows

1. **Knowledge base (system prompt)** — hand-written, covering: what BndBox is; the three portals (Brand, Reseller, Admin); how reseller approval and brand applications work; Amazon/Walmart/eBay requirements (LLC, EIN, resale certificate, invoices for ungating); Partner Hub for brands/distributors/wholesalers/retailers; subscription tiers; support and contact info; the NJ, United States office.
2. **Live data tools** — the assistant can call:
  - `search_brands` — looks up `brands_directory` by name/category/department, returns names, categories, approval rate, response time.
  - `count_brands` — total active brands, and counts per category, for "how many brands do you have" questions.
  - `search_distributors` — verified distributors by category/region from `distributors`.
  - `capture_lead` — when the visitor shares an email, saves it so you can follow up.
   Tools only expose public, non-sensitive fields (never contact emails of brands).
3. **Escalation** — if it can't answer, it offers the human handoff instead of guessing.

### Conversation storage

Stored in the database so you can read what visitors ask.

- New table `chat_conversations`: visitor id (anonymous cookie), optional `user_id`, optional captured email/name, page the chat started on, timestamps.
- New table `chat_messages`: conversation id, role, message parts (JSON), created_at.
- Anonymous visitors get a long-lived `bndbox_chat_id` cookie so their one conversation restores on return.
- Access rules: visitors can read/write only their own conversation (matched by visitor id passed to the edge function, which does the writing with service role); admins can read all. Nothing is publicly listable.
- An admin view under Admin → "Chat Conversations" so you can browse transcripts and captured leads.

### Backend

- New Supabase edge function `chat-assistant`:
  - Validates input, loads the conversation, runs the AI SDK with the system prompt + tools, streams the response back.
  - Persists the user message and the completed assistant message.
  - Surfaces rate-limit (429) and credit (402) errors as readable messages in the widget.
- Uses Lovable AI Gateway with `openai/gpt-5.6-sol` via the Responses API, streaming.
- Requires the `LOVABLE_API_KEY` secret — I'll provision it if missing.

### Technical notes

- UI built from AI Elements primitives (`conversation`, `message`, `prompt-input`, `shimmer`, `tool`) installed into `src/components/ai-elements/`, wrapped in a `ChatWidget` mounted once in `App.tsx` so it appears on all public pages (hidden inside the dashboards).
- Tool activity renders as a collapsed, domain-styled card ("Searched 1,240 brands").
- Styling uses existing semantic tokens; assistant messages unstyled on surface, user messages in `primary`/`primary-foreground`.
- Widget is lazy-loaded so it doesn't affect landing-page LCP or SEO.
- The agent identity uses the existing BndBox logo mark, not a generic sparkle icon.

### Build order

1. Migration: `chat_conversations` + `chat_messages` with grants and RLS.
2. Edge function `chat-assistant` with knowledge base + tools.
3. AI Elements install and `ChatWidget` UI + launcher.
4. Human-handoff form wired to the existing contact/lead flow.
5. Admin transcripts page.
6. End-to-end check in the preview: ask a knowledge question, a brand-lookup question, reload to confirm the conversation restores.  
  
My indication: I want AI to answers ussers query rather than directly reaching to human being, yes if required whhen AI reach out of its knowledge. AI must know each and every detail of BNDBOX to answer any related to its own