import type { ChartWidget, MapWidget, UsageData } from "./types"

export interface MockResponse {
  id: string
  keywords: string[]
  content: string
  suggestions: string[]
  chart?: ChartWidget
  map?: MapWidget
  sourceInstitutions?: string[]
}

export const MOCK_RESPONSES: MockResponse[] = [
  {
    id: "bank-match",
    keywords: ["match sales report", "match sales", "sales report"],
    content:
      "Two deposits from Friday ($847 and $456) are still in transit and will post Monday. Once they post, the gap between Clover sales and your bank balance narrows to $12 — which is your processing fee for the period.\n\n**Reconciliation summary**\n\n- Clover sales: $4,827\n- Bank deposits: $3,512\n- Difference: $1,315 (in-transit + fees)",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "Was Saturday worth it?",
    ],
    chart: {
      kind: "bar",
      title: "Gap Breakdown",
      labels: ["In-transit Deposits", "Processing Fees"],
      datasets: [{ label: "Gap Breakdown ($)", data: [1303, 12] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "Chase", "Bank of America"],
  },
  {
    id: "open-past-9",
    keywords: ["past 9", "9pm", "late hours", "stay open"],
    content:
      "Over the last 30 days, your average revenue after 9pm is $380 per night across about 15 orders. The cost to stay open — extra staff hours, utilities, and additional prep — runs about $420 per night. So you're losing roughly $40 a night by staying open. The exception is Fridays and Saturdays, where post-9pm revenue averages $680. If you cut late hours to weekdays only, you'd save about $200/week.\n\n- Avg Post-9pm Revenue: $380\n- Avg Post-9pm Cost: $420\n- Daily Loss: -$40\n- Fri/Sat Avg Revenue: $680",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "Was Saturday worth it?",
    ],
    chart: {
      kind: "bar",
      title: "Post-9pm Revenue vs Cost",
      labels: ["Mon-Thu Avg", "Fri-Sat Avg"],
      datasets: [
        { label: "Revenue", data: [320, 680] },
        { label: "Cost", data: [420, 420] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "yesterday",
    keywords: ["yesterday", "full picture", "daily summary"],
    content:
      "Yesterday (Saturday) was a solid day. 94 orders totaling $4,100 in sales. Top sellers: brisket plate (28), margaritas (34), fish tacos (19). Maria handled 38 orders, Jamal 31, Carlos 25. There were 2 voids ($36) and 1 comp ($14). Processing fees came to $118, and one transaction for $85 is under review. Your batch settled and $3,932 should deposit tomorrow. On the expense side: $800 food delivery came in, labor was $1,400. Net cash for the day: roughly $1,782.\n\n- Orders: 94\n- Total Sales: $4,100\n- Processing Fees: $118\n- Net cash for the day: $1,782",
    suggestions: [
      "How much did I actually make last week?",
      "Where's all my money going?",
    ],
    chart: {
      kind: "bar",
      title: "Yesterday Sales Mix",
      labels: ["Brisket Plate", "Margaritas", "Fish Tacos", "Other"],
      datasets: [{ label: "Orders", data: [28, 34, 19, 13] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "best-employee",
    keywords: ["best employee", "employee", "staff performance"],
    content:
      "By gross sales, Maria leads at $4,200 last week. But Maria's customers pay mostly Amex (3.2% avg fee), she comped $180 and voided $90. Net contribution: $3,795. Jamal rang up $3,600 but his customers skew debit (1.1% avg fee), with only $40 in comps and no voids. Net contribution: $3,520. Maria still edges ahead, but Jamal is more efficient per dollar. Carlos did $2,800 with $210 in comps — that's worth a conversation.\n\n- Maria Net: $3,795\n- Jamal Net: $3,520\n- Carlos Net: $2,590\n- **Top Performer: Maria**",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "Is it worth staying open past 9?",
    ],
    chart: {
      kind: "bar",
      title: "Employee Net Contribution",
      labels: ["Maria", "Jamal", "Carlos"],
      datasets: [
        { label: "Gross Sales", data: [4200, 3600, 2800] },
        { label: "Fees & Comps", data: [405, 80, 270] },
        { label: "Net Contribution", data: [3795, 3520, 2590] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "American Express"],
  },
  {
    id: "charge-more",
    keywords: ["charge more", "pricing", "price increase"],
    content:
      "Three items stand out where your costs went up but your prices didn't. The brisket sandwich: ingredient cost up 18% this quarter, you're still charging $9, margin dropped from 52% to 44%. The fish tacos: cost up 12%, priced at $11, margin down from 48% to 42%. The chef's salad has been stable. Your brisket sandwich sells 40/day — even a $1 increase would add $1,200/month with minimal volume risk.\n\n- Brisket Margin: 52% → 44%\n- Fish Tacos: 48% → 42%\n- Brisket Sales: 40/day\n- Revenue Impact: +$1,200/mo",
    suggestions: [
      "Where's all my money going?",
      "Can I afford to give my staff a raise?",
    ],
    chart: {
      kind: "bar",
      title: "Menu Item Margins",
      labels: ["Brisket Sandwich", "Fish Tacos", "Chef Salad"],
      datasets: [
        { label: "3mo Ago Margin (%)", data: [52, 48, 38] },
        { label: "Current Margin (%)", data: [44, 42, 38] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "staff-raise",
    keywords: ["raise", "staff raise", "afford raise"],
    content:
      "Current payroll is $12,000/month. A $1/hour raise across your 6 full-time staff adds about $1,040/month. Your revenue has grown 8% quarter over quarter for the past three quarters, and your average monthly cash reserve after all expenses is $18,200. You can absorb it — even in a down month, your reserves cover the increase 17 times over. The trend supports it.\n\n- Current Payroll: $12K/mo\n- Raise Cost: $1,040/mo\n- Revenue Growth: +8% QoQ\n- Cash Reserve: $18.2K",
    suggestions: [
      "Where's all my money going?",
      "Am I going to be able to make payroll on Friday?",
    ],
    chart: {
      kind: "line",
      title: "Quarterly Revenue Growth",
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [{ label: "Quarterly Revenue ($)", data: [150000, 162000, 175000, 189000] }],
    },
    sourceInstitutions: ["QuickBooks", "Chase"],
  },
  {
    id: "food-waste",
    keywords: ["food waste", "waste", "throwing away"],
    content:
      "This week your POS shows you sold 300 chicken plates, 180 fish plates, and 220 pasta dishes. Based on your supplier invoices, you purchased enough for roughly 400, 210, and 240 servings respectively. That's a gap of about 100 chicken servings (25%), 30 fish (14%), and 20 pasta (8%). Chicken is your biggest waste problem — that's roughly $350 in lost product this week alone.\n\n- Chicken Waste: 25%\n- Fish Waste: 14%\n- Pasta Waste: 8%\n- Weekly Loss: $350",
    suggestions: [
      "Where's all my money going?",
      "What should I charge more for?",
    ],
    chart: {
      kind: "bar",
      title: "Food Waste by Item",
      labels: ["Chicken", "Fish", "Pasta"],
      datasets: [
        { label: "Purchased", data: [400, 210, 240] },
        { label: "Sold", data: [300, 180, 220] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "location",
    keywords: ["location", "locations", "worried"],
    content:
      "Downtown does $38,000/month in revenue. Suburb does $27,000. Looks like downtown wins, right? But downtown has $6,500 rent, $14,200 labor, and pays 2.8% in processing fees. Suburb has $2,800 rent, $8,600 labor, and 2.1% in fees. After rent, labor, and processing fees: Downtown nets $6,240/month. Suburb nets $8,100. Your 'smaller' location is actually more profitable by almost $2,000.\n\n- Downtown Revenue: $38K / Net: $6,240\n- Suburb Revenue: $27K / Net: $8,100",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "I'm paying way too much in fees. How bad is it?",
    ],
    chart: {
      kind: "bar",
      title: "Net Profit by Location",
      labels: ["Downtown", "Suburb"],
      datasets: [
        { label: "Revenue", data: [38000, 27000] },
        { label: "Expenses", data: [31760, 18900] },
        { label: "Net Profit", data: [6240, 8100] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks", "Chase"],
  },
  {
    id: "sysco",
    keywords: ["sysco", "vendor cost"],
    content:
      "QuickBooks shows $14,200 across 12 invoices from Sysco this quarter. But your bank shows 14 debits to Sysco totaling $15,800. The $1,600 gap breaks down to: two rush delivery surcharges ($340 each), one payment made before the invoice was entered ($580), and a credit memo that was never applied ($340). Your real cost is $15,800 — about 11% more than what's on the books.\n\n- Invoiced (QB): $14,200\n- Actually Paid: $15,800\n- Gap: $1,600 (+11%)",
    suggestions: [
      "Where's all my money going?",
      "I feel like we're throwing away too much food. Are we?",
    ],
    chart: {
      kind: "bar",
      title: "Sysco Invoiced vs Actually Paid",
      labels: ["Invoiced", "Actually Paid"],
      datasets: [{ label: "Amount ($)", data: [14200, 15800] }],
    },
    sourceInstitutions: ["QuickBooks", "Chase"],
  },
  {
    id: "chargebacks",
    keywords: ["chargebacks", "chargeback", "disputes"],
    content:
      "You've had 14 chargebacks this month totaling $1,840. Looking at the pattern: 9 of them (64%) were Friday or Saturday night transactions, all over $75, and 6 of those were from the same server station. The most common reason code is 'service not received' — which usually means the customer disputes a bar tab. It looks like late-night high-dollar bar tabs are your biggest exposure.\n\n- Total Chargebacks: 14\n- Total Amount: $1,840\n- Weekend %: 64%\n- Avg Per CB: $131",
    suggestions: [
      "I'm paying way too much in fees. How bad is it?",
      "Give me the full picture on yesterday.",
    ],
    chart: {
      kind: "bar",
      title: "Chargebacks by Day of Week",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{ label: "Chargebacks", data: [1, 0, 1, 2, 4, 5, 1] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "American Express", "Chase"],
  },
  {
    id: "fees",
    keywords: ["fees", "processing fees", "too much fees"],
    content:
      "This month you paid $2,870 in total processing fees. Amex is your most expensive at $1,120 (avg 3.2% per transaction), followed by Visa at $940 (2.4%), Mastercard at $610 (2.3%), and Discover at $200 (2.5%). Here's what makes it interesting: your Amex customers spend $47 per visit on average versus $28 for Visa. They're expensive but they're your biggest spenders.\n\n- Total Fees: $2,870\n- Amex: $1,120 (3.2% avg)\n- Visa: $940 (2.4% avg)\n- Mastercard: $610 (2.3% avg)",
    suggestions: [
      "Give me the full picture on yesterday.",
    ],
    chart: {
      kind: "bar",
      title: "Processing Fees by Card Network",
      labels: ["Amex", "Visa", "Mastercard", "Discover"],
      datasets: [
        { label: "Fees ($)", data: [1120, 940, 610, 200] },
        { label: "Avg Ticket ($)", data: [47, 28, 26, 31] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "American Express"],
  },
  {
    id: "payroll",
    keywords: ["payroll", "friday", "make payroll"],
    content:
      "Right now you have $11,400 in the bank. Payroll on Friday is $8,200, and you have two vendor invoices totaling $3,100 due before then. That leaves you with just $100 before the deposits land. But — you have $4,800 in settled card transactions depositing Wednesday and another $3,200 coming Thursday. After everything clears, you should land around $8,100 by Friday evening. You'll be fine, but it'll be tight.\n\n- Current Balance: $11,400\n- Payroll Friday: $8,200\n- Bills Due: $3,100\n- Projected Friday: $8,100",
    suggestions: [
      "Why did my bank balance drop this month even though sales were up?",
      "Can I afford to give my staff a raise?",
    ],
    chart: {
      kind: "bar",
      title: "Projected Balance Through Friday",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{ label: "Balance ($)", data: [11400, 11400, 16200, 19400, 8100] }],
    },
    sourceInstitutions: ["QuickBooks", "Chase", "Bank of America"],
  },
  {
    id: "great-month",
    keywords: ["bank balance drop", "sales were up", "balance drop"],
    content:
      "Your sales were actually up 15% this month — $62,400 vs $54,300 last month. But your bank balance dropped $3,100. Here's what happened: A chargeback batch of $3,200 hit on the 14th. Your quarterly tax estimate of $4,800 went out on the 15th. Annual insurance premium of $2,900 auto-debited on the 18th. So you had $10,900 in unusual outflows that ate your growth and then some.\n\n- Sales Growth: +15%\n- Balance Change: -$3,100\n- Unusual Outflows: $10,900\n- This Month: $62,400",
    suggestions: [
      "Can I afford to give my staff a raise?",
    ],
    chart: {
      kind: "line",
      title: "Monthly Bank Balance",
      labels: ["Day 1", "Day 5", "Day 10", "Day 14", "Day 18", "Day 25", "Day 30"],
      datasets: [{ label: "Bank Balance ($)", data: [28000, 29400, 31200, 28000, 25100, 26800, 24900] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks", "Chase"],
  },
  {
    id: "saturday",
    keywords: ["saturday"],
    content:
      "Saturday brought in $7,840 across 162 orders. But here's the cost side: weekend staff was $2,400, food/beverage cost of goods was $2,740, and you had $180 in overtime bumps. Total cost to run Saturday: $5,320. That leaves you $2,520 in gross profit — about a 32% margin. Decent, but your weekday average margin is 41%. Saturdays are busier but less efficient.\n\n- Revenue: $7,840\n- Total Costs: $5,320\n- Profit: $2,520\n- Margin: 32% (vs 41% weekday avg)",
    suggestions: [
      "Is it worth staying open past 9?",
      "Which location should I be worried about?",
    ],
    chart: {
      kind: "bar",
      title: "Saturday vs Weekday Performance",
      labels: ["Saturday", "Weekday Avg"],
      datasets: [
        { label: "Revenue", data: [7840, 5600] },
        { label: "Costs", data: [5320, 3300] },
        { label: "Profit", data: [2520, 2300] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "money-going",
    keywords: ["money", "where's my money", "spending"],
    content:
      "This month you've spent $38,400 total. Here's the breakdown: Payroll is your biggest at $12,000 (31%), followed by suppliers/inventory at $9,800 (26%), rent at $4,500 (12%), card processing fees at $2,870 (7%), utilities at $2,340 (6%), chargebacks at $1,200 (3%), and other expenses at $5,690 (15%). Your processing fees alone are more than your electric bill.\n\n- Total Spending: $38,400\n- Payroll: $12,000 (31%)\n- Processing Fees: $2,870 (7%)\n- Chargebacks: $1,200 (3%)",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "I'm paying way too much in fees. How bad is it?",
    ],
    chart: {
      kind: "bar",
      title: "Monthly Expense Breakdown",
      labels: ["Payroll", "Suppliers", "Rent", "Fees", "Utilities", "Chargebacks", "Other"],
      datasets: [{ label: "Monthly Expenses ($)", data: [12000, 9800, 4500, 2870, 2340, 1200, 5690] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks", "Chase"],
  },
  {
    id: "last-week",
    keywords: ["last week", "make last week"],
    content:
      "Last week you brought in $14,820 in total sales across the register. After processing fees ($431), chargebacks ($180), and one pending hold ($85), your net settled amount was $14,124. Your bank received $14,124 from card settlements, plus $940 in cash deposits and a $200 catering check — so your actual total income was $15,264.\n\n- Gross Sales: $14,820\n- Processing Fees: $431\n- Chargebacks: $180\n- **Actual Income: $15,264**",
    suggestions: [
      "Give me the full picture on yesterday.",
      "Where's all my money going?",
    ],
    chart: {
      kind: "bar",
      title: "Last Week Revenue Breakdown",
      labels: ["Gross Sales", "After Fees", "After CB", "Net Settled", "Cash/Other", "Actual Income"],
      datasets: [{ label: "Revenue ($)", data: [14820, 14389, 14209, 14124, 15264, 15264] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "Chase", "American Express"],
  },
  {
    id: "top-margin",
    keywords: ["highest margin", "menu margin", "most profitable item", "best margin"],
    content:
      "Your top three margin items right now are margaritas (68%), appetizer sampler (61%), and the chef's salad (38%). Margaritas are your standout — low ingredient cost, high perceived value, and they sell 34 a day on average. Compare that to the brisket sandwich, which has slipped to 44% margin after the recent beef price increase. If you want to protect profitability, push the margaritas and appetizers — they're doing the heavy lifting.\n\n- Margaritas: 68% margin\n- Appetizer Sampler: 61% margin\n- Chef's Salad: 38% margin\n- Brisket Sandwich: 44% margin (↓ from 52%)",
    suggestions: [
      "What should I charge more for?",
      "Where's all my money going?",
    ],
    chart: {
      kind: "bar",
      title: "Item Margin Comparison (%)",
      labels: ["Margaritas", "App Sampler", "Chef Salad", "Fish Tacos", "Brisket"],
      datasets: [{ label: "Margin (%)", data: [68, 61, 38, 42, 44] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "low-ticket",
    keywords: ["dragging down", "average ticket", "low ticket", "average order"],
    content:
      "Your current average ticket is $28.40. Three item types are pulling it down: side-only orders (avg $6.50, 18% of transactions), single-drink orders at the bar (avg $7.20, 11% of transactions), and kids' meals (avg $8.90, 9% of transactions). Together they account for 38% of your transactions but only 14% of revenue. Adding a combo upsell prompt at the register for side orders could move the needle — even a $3 upsell on half those transactions adds about $900/month.\n\n- Current Avg Ticket: $28.40\n- Side-only Orders: $6.50 avg (18% of txns)\n- Single Drinks: $7.20 avg (11% of txns)\n- Upsell Opportunity: ~$900/mo",
    suggestions: [
      "What should I charge more for?",
      "Which menu items have the highest margin?",
    ],
    chart: {
      kind: "bar",
      title: "Avg Ticket by Order Type ($)",
      labels: ["Full Meal", "Kids Meal", "Single Drink", "Side Only"],
      datasets: [{ label: "Avg Ticket ($)", data: [38.50, 8.90, 7.20, 6.50] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data"],
  },
  {
    id: "over-ordering",
    keywords: ["over-ordering", "over ordering", "ordering too much", "over order"],
    content:
      "Based on your last four weeks of POS sales vs. supplier invoices, chicken is your biggest over-order — you're purchasing about 25% more than you sell. Fish is next at 14% excess, and pasta at 8%. On the flip side, you've run low on margarita mix twice this month, suggesting you're under-ordering on bar supplies. Trimming your chicken order by 20% would save roughly $280/week without risking stockouts based on your current sell-through rate.\n\n- Chicken: 25% excess (~$280/week)\n- Fish: 14% excess (~$90/week)\n- Pasta: 8% excess (~$40/week)\n- Margarita mix: under-ordered (2 stockouts)",
    suggestions: [
      "I feel like we're throwing away too much food. Are we?",
      "Where's all my money going?",
    ],
    chart: {
      kind: "bar",
      title: "Ordered vs. Sold (weekly avg, servings)",
      labels: ["Chicken", "Fish", "Pasta"],
      datasets: [
        { label: "Ordered", data: [400, 210, 240] },
        { label: "Sold", data: [300, 180, 220] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "food-cost-pct",
    keywords: ["food cost percentage", "food cost compare", "food cost percent"],
    content:
      "Your food cost percentage this month is 31.2%, up from 28.4% last month. The jump is driven mostly by beef prices — your brisket and burger items are now costing about 18% more from your supplier. Your beverage cost held steady at 19.1%. The industry benchmark for a full-service restaurant is 28–32%, so you're at the high end but not out of range. If beef costs don't normalize, a $1 price increase on brisket items would bring your food cost back to ~28.8%.\n\n- This Month: 31.2%\n- Last Month: 28.4%\n- Change: +2.8 pts\n- Beverage Cost: 19.1% (stable)\n- Benchmark: 28–32%",
    suggestions: [
      "What should I charge more for?",
      "I feel like we're throwing away too much food. Are we?",
    ],
    chart: {
      kind: "line",
      title: "Food Cost % — Last 4 Months",
      labels: ["2 Months Ago", "Last Month", "This Month"],
      datasets: [{ label: "Food Cost (%)", data: [27.8, 28.4, 31.2] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "QuickBooks"],
  },
  {
    id: "refunds",
    keywords: ["refunds", "refund cost", "how much refunds", "cost me in refunds"],
    content:
      "This month you've had $2,240 in total refunds and voids. That breaks down to: 18 voids totaling $780 (mostly mid-service order changes), 9 full refunds totaling $1,020, and 14 chargebacks totaling $1,840 — though chargebacks are handled separately through your processor. The $780 in voids is on the higher side; your monthly average over the past year is $490. Two servers account for 11 of the 18 voids, which is worth a conversation.\n\n- Voids: $780 (18 transactions)\n- Refunds: $1,020 (9 transactions)\n- Chargebacks: $1,840 (14 transactions)\n- Avg Monthly Voids: $490",
    suggestions: [
      "Why do I keep getting chargebacks?",
      "Who's my best employee?",
    ],
    chart: {
      kind: "bar",
      title: "Refunds & Voids This Month ($)",
      labels: ["Voids", "Refunds", "Chargebacks"],
      datasets: [{ label: "Amount ($)", data: [780, 1020, 1840] }],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "American Express", "Chase"],
  },
  {
    id: "card-spend",
    keywords: ["card brand", "highest spend", "spend per customer", "card brand spend", "highest spend per"],
    content:
      "Amex cardholders spend the most per visit by far — $47 average ticket versus $31 for Discover, $28 for Visa, and $26 for Mastercard. Amex is only 22% of your transaction volume but generates 37% of your card revenue. The tradeoff is cost: Amex charges you 3.2% per transaction versus 2.3–2.5% for the others. Even after fees, your net revenue per Amex transaction ($45.49) beats Visa ($27.33) and Mastercard ($25.40) comfortably.\n\n- Amex: $47 avg ticket / $45.49 net after fees\n- Discover: $31 avg ticket / $30.22 net\n- Visa: $28 avg ticket / $27.33 net\n- Mastercard: $26 avg ticket / $25.40 net",
    suggestions: [
      "I'm paying way too much in fees. How bad is it?",
      "How much did I actually make last week?",
    ],
    chart: {
      kind: "bar",
      title: "Avg Ticket by Card Brand ($)",
      labels: ["Amex", "Discover", "Visa", "Mastercard"],
      datasets: [
        { label: "Avg Ticket ($)", data: [47, 31, 28, 26] },
        { label: "Net After Fees ($)", data: [45.49, 30.22, 27.33, 25.40] },
      ],
    },
    sourceInstitutions: ["Clover Data", "AccessOne Data", "American Express"],
  },
  {
    id: "business-address",
    keywords: ["business address", "change my address", "update my address"],
    content: "Done! Your business address has been updated to 456 Market St, San Francisco, CA 94105. The change will be reflected on your account within 1–2 business days. You'll receive a confirmation email at your primary address shortly.",
    suggestions: ["Update my primary email", "Update my phone number", "Change my statement descriptor"],
  },
]

// ─── Explore Prompts ──────────────────────────────────────────────────────────
//
// Structure for the tabbed prompt explorer on the welcome screen.
// BE dev: replace the `prompts` array in each category with a real API call,
// e.g. GET /api/nanci/prompts?category=overview  →  string[]
// The category `id` should match the API's category identifier.

export interface PromptCategory {
  id: string
  label: string
  prompts: string[]
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "overview",
    label: "Overview",
    prompts: [
      "Give me the full picture on yesterday.",
      "How much did I actually make last week?",
      "Why did my bank balance drop this month even though sales were up?",
      "Was Saturday worth it?",
      "Where's all my money going?",
      "Which location should I be worried about?",
    ],
  },
  {
    id: "top-items",
    label: "Top Items",
    prompts: [
      "What should I charge more for?",
      "What's my best-selling item this week?",
      "Which menu items have the highest margin?",
      "What items are dragging down my average ticket?",
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    prompts: [
      "I feel like we're throwing away too much food. Are we?",
      "How much is Sysco costing me?",
      "Which ingredients am I over-ordering?",
      "How does my food cost percentage compare to last month?",
    ],
  },
  {
    id: "operation",
    label: "Operation",
    prompts: [
      "Is it worth staying open past 9?",
      "Can I afford to give my staff a raise?",
      "Am I going to be able to make payroll on Friday?",
      "Who's my best employee?",
    ],
  },
  {
    id: "refunds-voids",
    label: "Refunds & Voids",
    prompts: [
      "Why do I keep getting chargebacks?",
      "Which server has the most voids this week?",
      "How much did refunds cost me this month?",
      "Are my chargebacks trending up or down?",
    ],
  },
  {
    id: "payment",
    label: "Payment",
    prompts: [
      "Why doesn't my bank match my sales report?",
      "I'm paying way too much in fees. How bad is it?",
      "Which card brand has the highest spend per customer?",
      "Are any transactions still pending from last week?",
    ],
  },
  {
    id: "account-maintenance",
    label: "Maintenance",
    prompts: [
      "Change my business address",
      "Update my primary email",
      "Update my phone number",
      "Change my statement descriptor",
      "Update customer service phone",
      "Update my business name",
    ],
  },
]

export interface ScriptedTurn {
  role: "user" | "assistant"
  content: string
  map?: MapWidget
}

export const SCRIPTED_CONVERSATIONS: Record<string, ScriptedTurn[]> = {
  "Change my business address": [
    { role: "user", content: "Change my business address" },
    { role: "assistant", content: "Sure. Your current business address on file is:\n\n142 Oak Street, Austin, TX 78701\n\nWhat would you like to change it to? Please include street, city, state, and ZIP.", map: { address: "142 Oak Street, Austin, TX 78701", lat: 30.2645, lng: -97.7430 } },
    { role: "user", content: "456 Market St, San Francisco, CA 94105" },
    { role: "assistant", content: "Got it — just to confirm, you'd like to update your business address from 142 Oak Street, Austin, TX 78701 to:\n\n456 Market St, San Francisco, CA 94105\n\nIs that correct?\n\n{{MAP}}", map: { address: "456 Market St, San Francisco, CA 94105", lat: 37.7915, lng: -122.3972 } },
    { role: "user", content: "Yes, that's correct." },
    { role: "assistant", content: "Done! Your business address has been updated to 456 Market St, San Francisco, CA 94105. The change will be reflected on your account within 1–2 business days. You'll receive a confirmation email at your primary address shortly." },
  ],
  "Update my primary email": [
    { role: "user", content: "Update my primary email" },
    { role: "assistant", content: "Of course. Your current primary email is teresa.w@email.com — this is where we send account notifications, receipts, and important updates.\n\nWhat would you like to change it to?" },
    { role: "user", content: "teresa.walker@walkerbiz.com" },
    { role: "assistant", content: "Just to confirm — you want to change your primary email from teresa.w@email.com to teresa.walker@walkerbiz.com. Is that right?" },
    { role: "user", content: "Yes, go ahead." },
    { role: "assistant", content: "Your primary email has been updated to teresa.walker@walkerbiz.com. A confirmation link has been sent to your old address to verify the change. Future notifications will go to the new address once confirmed." },
  ],
  "Update my phone number": [
    { role: "user", content: "Update my phone number" },
    { role: "assistant", content: "No problem. Your current phone number on file is (512) 334-7821, used for account verification and support callbacks.\n\nWhat's the new number you'd like to use?" },
    { role: "user", content: "(415) 867-5309" },
    { role: "assistant", content: "To confirm — updating your contact number from (512) 334-7821 to (415) 867-5309. Correct?" },
    { role: "user", content: "That's right." },
    { role: "assistant", content: "Your phone number has been updated to (415) 867-5309. If you ever need to verify your account, that's the number we'll use going forward." },
  ],
  "Change my statement descriptor": [
    { role: "user", content: "Change my statement descriptor" },
    { role: "assistant", content: "Sure — your statement descriptor is what appears on your customers' credit card statements after a purchase. Your current descriptor is \"WALKER'S BOOKS\" (13 characters).\n\nWhat would you like it to say? Keep it under 22 characters so it displays cleanly." },
    { role: "user", content: "WALKER BISTRO SF" },
    { role: "assistant", content: "\"WALKER BISTRO SF\" is 16 characters — perfect. Just to confirm, this will replace \"WALKER'S BOOKS\" on all new transactions. Ready to update?" },
    { role: "user", content: "Yes, update it." },
    { role: "assistant", content: "Done! Your statement descriptor has been changed to \"WALKER BISTRO SF\". It will appear on all new transactions going forward. Existing pending transactions may still show the old descriptor." },
  ],
  "Update customer service phone": [
    { role: "user", content: "Update customer service phone" },
    { role: "assistant", content: "Got it. Your current customer service number is (512) 334-7821 — this is what appears on receipts and cardholder dispute communications.\n\nWhat would you like to change it to?" },
    { role: "user", content: "(415) 555-0192" },
    { role: "assistant", content: "Confirm update from (512) 334-7821 to (415) 555-0192 for customer service? This will appear on all future receipts." },
    { role: "user", content: "Yes, confirm." },
    { role: "assistant", content: "Updated! Your customer service phone is now (415) 555-0192. Customers will see this number on their receipts starting with your next batch." },
  ],
  "Update my business name": [
    { role: "user", content: "Update my business name" },
    { role: "assistant", content: "I can help with that. Your business name is currently registered as \"Walker's Roadhouse LLC\".\n\nWhat would you like to change it to? If this is a legal entity name change, you may need to provide supporting documentation such as an updated business license." },
    { role: "user", content: "Walker's Roadhouse & Catering LLC" },
    { role: "assistant", content: "Got it — changing from \"Walker's Roadhouse LLC\" to \"Walker's Roadhouse & Catering LLC\". Is this a legal name change or just a DBA (doing business as) update?" },
    { role: "user", content: "It's a legal name change." },
    { role: "assistant", content: "Understood. Your business name has been updated to Walker's Roadhouse & Catering LLC. Since this is a legal name change, our compliance team may follow up within 2–3 business days to request a copy of your updated documentation. Heads up — your statement descriptor on customer receipts still reads \"WALKER'S BOOKS.\" Would you like me to update that to match the new business name too? You'll receive a confirmation at your primary email shortly." },
  ],
}

// Questions flagged data-welcome="true" in Webflow
export const WELCOME_SUGGESTIONS = [
  "Give me the full picture on yesterday.",
  "How much is Sysco costing me?",
  "Was Saturday worth it?",
  "How much did I actually make last week?",
  "Who's my best employee?",
  "Can I afford to give my staff a raise?",
]

const QUESTION_TITLES: Record<string, string> = {
  "bank-match": "Why doesn't my bank match my sales report?",
  "open-past-9": "Is it worth staying open past 9?",
  "yesterday": "Give me the full picture on yesterday.",
  "best-employee": "Who's my best employee?",
  "charge-more": "What should I charge more for?",
  "staff-raise": "Can I afford to give my staff a raise?",
  "food-waste": "I feel like we're throwing away too much food. Are we?",
  "location": "Which location should I be worried about?",
  "sysco": "How much is Sysco costing me?",
  "chargebacks": "Why do I keep getting chargebacks?",
  "fees": "I'm paying way too much in fees. How bad is it?",
  "payroll": "Am I going to be able to make payroll on Friday?",
  "great-month": "Why did my bank balance drop this month even though sales were up?",
  "saturday": "Was Saturday worth it?",
  "money-going":    "Where's all my money going?",
  "last-week":      "How much did I actually make last week?",
  "top-margin":     "Which menu items have the highest margin?",
  "low-ticket":     "What items are dragging down my average ticket?",
  "over-ordering":  "Which ingredients am I over-ordering?",
  "food-cost-pct":  "How does my food cost percentage compare to last month?",
  "refunds":        "How much did refunds cost me this month?",
  "card-spend":     "Which card brand has the highest spend per customer?",
}

export const ALL_QUESTIONS = MOCK_RESPONSES.map((r) => QUESTION_TITLES[r.id] ?? r.id)

export const DEFAULT_RESPONSE =
  "That's a great question! I don't have specific data on that right now, but I'd suggest checking your reports dashboard or asking your account manager. Is there something else I can help you analyze?"

export const DEFAULT_SUGGESTIONS = [
  "Give me the full picture on yesterday.",
  "Where's all my money going?",
  "Can I afford to give my staff a raise?",
]

export const MOCK_USAGE: UsageData = {
  plan: "Gold",
  tokens: { used: 11200, limit: 15000 },
  chats: { used: 4, limit: 10 },
  files: { used: 2, limit: 5 },
}

export const PLAN_TIERS: { name: UsageData["plan"]; tokensPerDay: number; chatsPerDay: number | null; filesMax: number | null; price: string }[] = [
  { name: "Bronze",  tokensPerDay: 5000,  chatsPerDay: 5,    filesMax: 2,    price: "$19/mo" },
  { name: "Gold",    tokensPerDay: 15000, chatsPerDay: 10,   filesMax: 5,    price: "$49/mo" },
  { name: "Diamond", tokensPerDay: 50000, chatsPerDay: null, filesMax: null, price: "$99/mo" },
]

export const MOCK_ACTIVITY = [
  { date: "Today",  title: "Why Did Tips Drop This Weekend",                              tokens: 5700  },
  { date: "May 11", title: "Is My Tuesday Rush Hour Getting Worse?",                      tokens: 12100 },
  { date: "May 9",  title: "Card Reader Went Offline — Did I Lose Sales?",               tokens: 6400  },
  { date: "May 8",  title: "% Volume by Card Brand and by BIN Number daily, MTD and YTD", tokens: 9800  },
  { date: "May 7",  title: "Top 15 merchants by BIN Number",                             tokens: 4200  },
]

export function findResponse(text: string): MockResponse | null {
  const lower = text.toLowerCase()
  return MOCK_RESPONSES.find((r) => r.keywords.some((kw) => lower.includes(kw.toLowerCase()))) ?? null
}
