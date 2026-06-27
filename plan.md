# Baguio Transient Booking Tool — Build Plan

> A micro-SaaS that handles a transient house's Facebook Messenger bookings for them.
> Solo build, evenings/weekends, while employed full-time.

---

## The product in one sentence

A guest taps a link, picks their dates and number of people, sees which rooms are free and the price, and reserves with a GCash deposit — while the owner manages everything from one screen and never gets double-booked.

**What it kills:** the daily "available po? magkano po?" grind, slow Messenger replies that lose bookings, and accidental double-bookings during peak season.

**Who it's for:** family-run Baguio transient houses with ~5–15 rooms that book through a Facebook page and refuse OTAs because of the 15–20% commission.

**What it is NOT:** a hotel management platform. No OTA listings, no front-desk workflow, no enterprise features. Those are the exact things this market already said no to.

---

## The one rule for this whole plan

At every phase, you find out whether to keep going **before** spending the big effort. You do not write the serious version until the cheap signals say go. This is what stops the six-month graveyard project.

---

## Phase 0 — Validate without needing anyone's cooperation
**Time: 2–3 evenings. Code written: none.**

Owners probably won't answer "can I interview you?" — so don't rely on that. Use the signals that need zero goodwill.

- [ ] Message 10–15 Baguio transient houses **as a guest** on Facebook. They have to reply — it's their income.
- [ ] For each, record: how long they took to reply, how many back-and-forth messages before you got a price, whether the flow felt clunky, what they asked you.
- [ ] Skim their Google reviews for booking questions posted *as reviews* (a sign there's no real booking channel).
- [ ] Note any owner already using an auto-reply or "AI assistant" — that's a competitor and a validator.

**Green light:** replies are slow/clunky and the pain is obvious. (It almost certainly will be — this is already documented in their own marketing.)
**Red light:** everyone replies in 2 minutes and the flow is smooth. (Unlikely, but if so — stop and rethink.)

> You can *optionally* DM a couple of friendly-looking owners directly, but treat any reply as a bonus, not the plan.

---

## Phase 1 — The one technical decision (decided)
**How the tool reaches guests.**

Two options existed:

| | In-Messenger bot (Meta API) | Shareable link ✅ chosen |
|---|---|---|
| Guest experience | Everything inside Messenger | Taps a link, opens a web page |
| Build effort | High | Low |
| Approval needed | Meta app review | None |
| Platform risk | Meta can change rules | You control everything |
| Good for | Scaling later | Proving demand now |

**Decision: start with the link.** It proves whether owners want this — the only thing you're trying to learn — at a fraction of the effort and with no Meta dependency. The in-Messenger version is a later upgrade if traction appears.

So the flow becomes: guest messages "available po?" → owner pastes their booking link → guest self-serves → owner gets notified.

---

## Phase 2 — Build the MVP (smallest version that's actually useful)
**Time: ~2–4 weekends. Stack chosen for speed (see below).**

### Build ONLY these features
- [ ] **Owner: add rooms** — name, capacity (max pax), price (with optional weekday/weekend rate).
- [ ] **Owner: availability calendar** — tap to mark a room booked/free for given dates, from a phone.
- [ ] **Guest: booking link** — picks dates + pax, instantly sees which rooms fit and the price.
- [ ] **Guest: reserve** — confirms a room, sees GCash deposit instructions, submits proof/reference.
- [ ] **System: double-booking lock** — a reserved room can't be booked again for overlapping dates.
- [ ] **Owner: notification** — gets pinged (email or simple in-app) on each new reservation to confirm.

### Do NOT build yet (these are traps that delay you)
- ❌ Reviews / ratings
- ❌ Analytics dashboards
- ❌ Multi-language toggle (just write the UI in Taglish from the start)
- ❌ Automated GCash payment verification (manual proof is fine for v1)
- ❌ The Meta/Messenger integration
- ❌ Multi-property accounts (one owner = one property for now)

Ship the spine first. Everything above can wait until a paying owner asks for it.

### Recommended stack (fastest path for you)
You came from mobile/desktop/system dev, so the instinct is a native owner app. **Don't, yet** — for an MVP, one web app you can deploy and fix in minutes beats an app you have to rebuild and resubmit. Native owner app is a Phase 4+ upgrade once people are paying.

- **One web app, two surfaces:** the guest booking link *and* the owner dashboard live in the same app (responsive, mobile-first — owners will use it on their phones).
- **Framework:** Next.js (React) — handles both the public link pages and the owner dashboard, deploys in one click.
- **Hosting:** Vercel (free tier is plenty to start).
- **Database:** Supabase or similar (Postgres + auth + storage out of the box — saves you building login and file upload for GCash proof).
- **Auth:** owner logs in with email/phone; guests need no account (just the link).
- **Why this:** zero servers to manage, free to run while validating, instant updates, and it's all in one codebase you can ship solo.

> This is a recommendation, not a religion. If you're faster in something else, use it. The point is: **one deployable web app, no native build, no infra to babysit.**

### Data you'll store (rough shape)
- `owners` — id, name, contact, gcash details, booking-link slug
- `rooms` — id, owner_id, name, capacity, weekday_rate, weekend_rate
- `bookings` — id, room_id, guest_name, guest_contact, check_in, check_out, pax, status (pending/confirmed/cancelled), deposit_ref
- Availability is derived from confirmed bookings + any manual blocks the owner adds.

---

## Phase 3 — Get 1–3 owners actually using it
**Time: ongoing. The real test.**

- [ ] Set up your most promising owners **for free**, in exchange for honest feedback + being test users.
- [ ] Do the setup *for* them (add their rooms/prices yourself) — don't make onboarding their problem.
- [ ] Watch how they actually use it. It will break in ways you didn't predict. That's the data.
- [ ] Fix the real problems; ignore the imaginary ones.

**Outreach script that beats "can I interview you?":**
> "I built a free tool that answers your booking messages and tracks your rooms so you don't double-book. Want me to set it up for you for free?"
> (Offering value > asking for time. Much higher reply rate. The working tool *is* the pitch.)

---

## Phase 4 — Charge, then decide if it has legs

- [ ] Once it's clearly saving an owner time, switch them to a small **flat monthly fee**.
- [ ] **Pricing logic:** anchor to what they save. It costs less than one bad week of lost bookings, and far less than the 15–20% an OTA would take. Even ₱300–₱700/month is trivial against that. Flat fee (not per-booking) keeps it simple and removes any "you're taking a cut like Airbnb" objection.
- [ ] **Go/no-go:** a handful of owners paying and telling friends = real business → expand. Nobody pays even after it works = you learned it cheaply → move on. No graveyard.

### Expansion path (only after Baguio works)
The exact same pattern — Messenger bookings, no OTA, GCash deposits — runs in every PH tourist town. Same product, bigger market:
- La Union (surf camps) · Tagaytay · Sagada · Siargao · Batangas beaches

### Later upgrades (only when a paying owner asks)
- In-Messenger bot via Meta API (the "smooth" guest experience)
- Native owner app (your home turf — build it once revenue justifies it)
- Automated GCash/payment verification
- Multi-property accounts, basic occupancy stats

---

## Risks & honest cautions
- **Low revenue per owner.** Budget operators. You'll need volume, and to price against saved OTA commission. Flat fee, keep costs near zero (free tiers) while small.
- **Some owners value the personal touch** ("not a bot"). Position the tool as *their assistant* that handles the repetitive first round — not a robot replacing them. Keep the human in the loop on confirmation.
- **There's already a tech-savvy operator** in this space (the one writing about rebuilding with "$20 of AI"). Study them. They validate the pain; your edge is a productized tool other owners can buy, not a one-off for a single property.
- **Don't flatten it to "a booking system."** That's the commodity trap — it puts you against Cloudbeds/Lodgify, which this market already rejected. Your wedge is "stop the Messenger grind for people who refuse OTAs."

---

## Your immediate next 3 actions
1. [ ] Phase 0: message 10–15 transient houses as a guest this week; log response times + friction.
2. [ ] Confirm the stack you'll actually build in (Next.js + Vercel + Supabase recommended).
3. [ ] Build the link MVP spine (rooms → availability → guest booking → double-book lock → owner notify).

---
*Plan generated as a living document — edit freely as you learn from real owners.*