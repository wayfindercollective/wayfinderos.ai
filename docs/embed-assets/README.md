# Embed placeholder references

Screenshots of the marketing-site coded placeholders, so the OS-side embed
modules can match them for an invisible cross-fade. Captured at 2x from the
production build.

There are exactly **two** embed-wrapped sections on the marketing site. The
other coded pieces (login pileup, dashboard shot, call grid, testimonial) are
illustrations or media slots, not product modules - do not build embeds for them.

## `/embed/ai-email` → `ai-email-done.png`

The AI email module in its resting "draft ready" state - the state the embed
reveals over. Header (subject + sender + cyan "DRAFT READY" chip), body draft,
"Approve & send" + two follow-up chips ("Make it more casual", "Move the call to
Wednesday"). Re-prompting retypes the draft. Already built and confirmed.

## `/embed/pipeline` → `pipeline-0..3-*.png`

Not a bare kanban - it's a **chromeless app shell**: a left sidebar with four
modules (CRM & pipeline / Payments / Commissions / Dashboard) over a browser
chrome bar, and a content panel that switches per module. The marketing
placeholder auto-tours the four to tell one story (a lead becomes revenue):

| File | Module | Shows |
|---|---|---|
| `pipeline-0-crm.png` | CRM & pipeline | 3-column board (New leads / Call booked / Won) with deal cards; a "just booked" card highlighted |
| `pipeline-1-payments.png` | Payments | a payment plan schedule, first instalment paid, rest scheduled |
| `pipeline-2-commissions.png` | Commissions | a commissions table, one row recalculated |
| `pipeline-3-dashboard.png` | Dashboard | stat tiles + a live rising collections chart |

To match: keep the sidebar + module switching, default to the CRM board.
Interactions (dragging a card, switching modules) are **browser-local only** -
see the no-write note in `../EMBED-TEST-BRIEF.md`.
