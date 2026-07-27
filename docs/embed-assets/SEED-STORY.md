# The canonical lead→revenue story (seed spec)

The marketing pipeline placeholder already encodes one coherent story across all
four panels. Seed the demo org with **this exact data** and the embed will both
match the placeholder visually and hang together as one narrative.

## The spine

Sarah Mitchell buys the **Momentum Program** ($4,800) on a **4 × $1,200** plan.
The **first $1,200 collects today**. Her closer **Marcus James** earns **12%** of
it, which tips his month to a tier bonus. That one payment is what moves the
dashboard's "collected this month" number.

So the same deal appears in all four modules: as a record in CRM, as the plan in
Payments, as the commission line in Commissions, and inside the collected total
on the Dashboard.

## Exact values per panel (match the screenshots in this folder)

**CRM board** (`pipeline-0-crm.png`) - three columns:
- *New leads (3):* Sarah Mitchell · Dan Okafor (webchat, replied 2m ago) · Priya Shah (form fill)
- *Call booked (2):* Leo Grant (tomorrow 10:30) · Mia Torres (Fri 1:00)
- *Won (4):* Jordan Lee (Momentum · $4,800) · Ana Costa (Foundations · $2,400) · +2

**Payments** (`pipeline-1-payments.png`) - Sarah Mitchell, Momentum Program,
$4,800, 4 payments: **Today $1,200 Paid**, then Aug 21 / Sep 21 / Oct 21, each
$1,200 Scheduled.

**Commissions** (`pipeline-2-commissions.png`):
| Coach | Tier | Collected | Payout |
|---|---|---|---|
| Alex Rivera | Tier 1 · 10% | $9,400 | $940 |
| **Marcus James** | **Tier 2 · 12%** | **$12,800** | **$1,536 (+$144)** |
| Nina Park | Tier 2 · 12% | $11,050 | $1,326 |

The **+$144** = 12% of Sarah's $1,200 - the through-line from her payment to his
payout.

**Dashboard** (`pipeline-3-dashboard.png`): Collected this month **$85,500**
(the placeholder animates $84,300 → $85,500, i.e. +$1,200 = Sarah's payment) ·
On schedule $31,200 · Overdue $0 · a rising 12-week collections chart.

## One tension to resolve (read-only snapshot vs. the placeholder's time-lapse)

The placeholder narrates a *progression in time* (a lead books → signs → pays →
commission → dashboard), so it shows Sarah in **New leads ("just booked")**. A
read-only seed is a **single snapshot** - all four panels read the same DB state
at once - and in that snapshot Sarah has already paid, so she belongs in **Won**,
not New leads.

Recommended: seed the **"just closed" snapshot** - Sarah in Won, her plan active
with the first payment collected, driving Marcus's +$144 and the dashboard total.
Keep Dan/Priya/Leo/Mia in the earlier columns so the board still looks alive.

If you seed her in Won, tell me and I'll move her card to Won in the marketing
placeholder too, so the cross-fade stays pixel-consistent. Either side is a
trivial change; they just need to agree.
