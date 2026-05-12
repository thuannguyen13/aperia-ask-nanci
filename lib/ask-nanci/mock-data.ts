import type { ChartWidget } from "./types"

export interface MockResponse {
  id: string
  keywords: string[]
  content: string
  suggestions: string[]
  chart?: ChartWidget
}

export const MOCK_RESPONSES: MockResponse[] = [
  {
    id: "bank-match",
    keywords: ["match sales report", "match sales", "sales report"],
    content:
      "Two deposits from Friday ($847 and $456) are still in transit and will post Monday. Once they do, your bank balance will match within $12 of your Clover sales. That remaining $12 is your processing fee for the period.\n\n**Reconciliation summary**\n\n- Clover sales: $4,827\n- Bank deposits: $3,512\n- Difference: $1,315 (in-transit + fees)",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "Was Saturday worth it?",
    ],
    chart: {
      kind: "bar",
      title: "Gap Breakdown",
      labels: ["In-transit Deposits", "Processing Fees"],
      datasets: [{ label: "Gap Breakdown ($)", data: [1303, 12], color: "#1EBBFF" }],
    },
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
        { label: "Revenue", data: [320, 680], color: "#2c5aa0" },
        { label: "Cost", data: [420, 420], color: "#e74c3c" },
      ],
    },
  },
  {
    id: "yesterday",
    keywords: ["yesterday", "full picture", "daily summary"],
    content:
      "Yesterday was a solid day. 94 orders totaling $4,100 in sales. Top sellers: brisket plate (28), margaritas (34), fish tacos (19). Maria handled 38 orders, Jamal 31, Carlos 25. There were 2 voids ($36) and 1 comp ($14). Processing fees came to $118, and one transaction for $85 is under review. Your batch settled and $3,940 should deposit tomorrow. On the expense side: $800 food delivery came in, labor was $1,400. Net contribution for the day: roughly $1,782.\n\n- Orders: 94\n- Total Sales: $4,100\n- Processing Fees: $118\n- Net Contribution: $1,782",
    suggestions: [
      "How much did I actually make last week?",
      "Where's all my money going?",
    ],
    chart: {
      kind: "bar",
      title: "Yesterday Sales Mix",
      labels: ["Brisket Plate", "Margaritas", "Fish Tacos", "Other"],
      datasets: [{ label: "Orders", data: [28, 34, 19, 13], color: "#2c5aa0" }],
    },
  },
  {
    id: "best-employee",
    keywords: ["best employee", "employee", "staff performance"],
    content:
      "By gross sales, Maria leads at $4,200 last week. But Maria's customers pay mostly Amex (3.2% avg fee), she comped $180 and voided $90. Net contribution: $3,795. Jamal rang up $3,600 but his customers skew debit (1.1% avg fee), with only $40 in comps and no voids. Net contribution: $3,520. Maria still edges ahead, but Jamal is more efficient per dollar. Carlos did $2,800 with $210 in comps — that's worth a conversation.\n\n- Maria Net: $3,795\n- Jamal Net: $3,520\n- Carlos Net: $2,530\n- **Top Performer: Maria**",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "Is it worth staying open past 9?",
    ],
    chart: {
      kind: "bar",
      title: "Employee Net Contribution",
      labels: ["Maria", "Jamal", "Carlos"],
      datasets: [
        { label: "Gross Sales", data: [4200, 3600, 2800], color: "#2c5aa0" },
        { label: "Fees & Comps", data: [405, 80, 270], color: "#e74c3c" },
        { label: "Net Contribution", data: [3795, 3520, 2530], color: "#00d4ff" },
      ],
    },
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
        { label: "3mo Ago Margin (%)", data: [52, 48, 38], color: "#2c5aa0" },
        { label: "Current Margin (%)", data: [44, 42, 38], color: "#e74c3c" },
      ],
    },
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
      datasets: [{ label: "Quarterly Revenue ($)", data: [150000, 162000, 175000, 189000], color: "#2c5aa0" }],
    },
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
        { label: "Purchased", data: [400, 210, 240], color: "#2c5aa0" },
        { label: "Sold", data: [300, 180, 220], color: "#00d4ff" },
      ],
    },
  },
  {
    id: "location",
    keywords: ["location", "locations", "worried"],
    content:
      "Downtown does $38,000/month in revenue. Suburb does $27,000. Looks like downtown wins, right? But downtown has $6,500 rent, $14,200 labor, and pays 2.8% in processing fees. Suburb has $2,800 rent, $8,600 labor, and 2.1% in fees. After all expenses: Downtown nets $6,240/month. Suburb nets $8,100. Your 'smaller' location is actually more profitable by almost $2,000.\n\n- Downtown Revenue: $38K / Net: $6,240\n- Suburb Revenue: $27K / Net: $8,100",
    suggestions: [
      "Can I afford to give my staff a raise?",
      "I'm paying way too much in fees. How bad is it?",
    ],
    chart: {
      kind: "bar",
      title: "Net Profit by Location",
      labels: ["Downtown", "Suburb"],
      datasets: [
        { label: "Revenue", data: [38000, 27000], color: "#2c5aa0" },
        { label: "Expenses", data: [31760, 18900], color: "#e74c3c" },
        { label: "Net Profit", data: [6240, 8100], color: "#00d4ff" },
      ],
    },
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
      datasets: [{ label: "Amount ($)", data: [14200, 15800], color: "#2c5aa0" }],
    },
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
      datasets: [{ label: "Chargebacks", data: [1, 0, 1, 2, 4, 5, 1], color: "#e74c3c" }],
    },
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
        { label: "Fees ($)", data: [1120, 940, 610, 200], color: "#e74c3c" },
        { label: "Avg Ticket ($)", data: [47, 28, 26, 31], color: "#2c5aa0" },
      ],
    },
  },
  {
    id: "payroll",
    keywords: ["payroll", "friday", "make payroll"],
    content:
      "Right now you have $11,400 in the bank. Payroll on Friday is $8,200, and you have two vendor invoices totaling $3,100 due before then. That puts you $100 short. But — you have $4,800 in settled card transactions depositing Wednesday and another $3,200 coming Thursday. After everything clears, you should land around $8,100 by Friday evening. You'll be fine, but it'll be tight.\n\n- Current Balance: $11,400\n- Payroll Friday: $8,200\n- Bills Due: $3,100\n- Projected Friday: $8,100",
    suggestions: [
      "How come I had a great month but I can't pay my bills?",
      "Can I afford to give my staff a raise?",
    ],
    chart: {
      kind: "bar",
      title: "Projected Balance Through Friday",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{ label: "Balance ($)", data: [11400, 11400, 16200, 19400, 8100], color: "#2c5aa0" }],
    },
  },
  {
    id: "great-month",
    keywords: ["great month", "bills", "cash flow"],
    content:
      "Your sales were actually up 15% this month — $62,400 vs $54,300 last month. But your bank balance dropped $3,100. Here's what happened: A chargeback batch of $3,200 hit on the 14th. Your quarterly tax estimate of $4,800 went out on the 15th. Annual insurance premium of $2,900 auto-debited on the 18th. So you had $10,900 in unusual outflows that ate your growth and then some.\n\n- Sales Growth: +15%\n- Balance Change: -$3,100\n- Unusual Outflows: $10,900\n- This Month: $62,400",
    suggestions: [
      "Can I afford to give my staff a raise?",
    ],
    chart: {
      kind: "line",
      title: "Monthly Bank Balance",
      labels: ["Day 1", "Day 5", "Day 10", "Day 14", "Day 18", "Day 25", "Day 30"],
      datasets: [{ label: "Bank Balance ($)", data: [28000, 29400, 31200, 28000, 25100, 26800, 24900], color: "#2c5aa0" }],
    },
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
        { label: "Revenue", data: [7840, 5600], color: "#0058cc" },
        { label: "Costs", data: [5320, 3300], color: "#ef4444" },
        { label: "Profit", data: [2520, 2300], color: "#06b6d4" },
      ],
    },
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
      datasets: [{ label: "Monthly Expenses ($)", data: [12000, 9800, 4500, 2870, 2340, 1200, 5690], color: "#2c5aa0" }],
    },
  },
  {
    id: "last-week",
    keywords: ["last week", "week", "make last week"],
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
      datasets: [{ label: "Revenue ($)", data: [14820, 14389, 14209, 14124, 15264, 15264], color: "#2c5aa0" }],
    },
  },
]

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
  "great-month": "How come I had a great month but I can't pay my bills?",
  "saturday": "Was Saturday worth it?",
  "money-going": "Where's all my money going?",
  "last-week": "How much did I actually make last week?",
}

export const ALL_QUESTIONS = MOCK_RESPONSES.map((r) => QUESTION_TITLES[r.id] ?? r.id)

export const DEFAULT_RESPONSE =
  "That's a great question! I don't have specific data on that right now, but I'd suggest checking your reports dashboard or asking your account manager. Is there something else I can help you analyze?"

export const DEFAULT_SUGGESTIONS = [
  "Give me the full picture on yesterday.",
  "Where's all my money going?",
  "Can I afford to give my staff a raise?",
]

export function findResponse(text: string): MockResponse | null {
  const lower = text.toLowerCase()
  return MOCK_RESPONSES.find((r) => r.keywords.some((kw) => lower.includes(kw.toLowerCase()))) ?? null
}
