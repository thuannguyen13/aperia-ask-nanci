"use client"

import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
  ScatterChart, Scatter,
  ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const C1 = "var(--chart-1)"
const C2 = "var(--chart-2)"
const C3 = "var(--chart-3)"
const C4 = "var(--chart-4)"
const C5 = "var(--chart-5)"

const monthly = [
  { month: "Jan", revenue: 4200, expenses: 3100, profit: 1100 },
  { month: "Feb", revenue: 3800, expenses: 2900, profit: 900 },
  { month: "Mar", revenue: 5100, expenses: 3400, profit: 1700 },
  { month: "Apr", revenue: 4700, expenses: 3200, profit: 1500 },
  { month: "May", revenue: 5600, expenses: 3700, profit: 1900 },
  { month: "Jun", revenue: 6200, expenses: 4100, profit: 2100 },
]

const scatter = Array.from({ length: 30 }, () => ({
  x: Math.round(10 + Math.random() * 90),
  y: Math.round(20 + Math.random() * 80),
}))

const pie = [
  { name: "Payroll", value: 12000, fill: C1 },
  { name: "Suppliers", value: 9800, fill: C2 },
  { name: "Rent", value: 4500, fill: C3 },
  { name: "Fees", value: 2870, fill: C4 },
  { name: "Other", value: 5690, fill: C5 },
]

const radar = [
  { subject: "Revenue", A: 90, B: 70 },
  { subject: "Margins", A: 65, B: 80 },
  { subject: "Volume", A: 85, B: 60 },
  { subject: "Retention", A: 70, B: 75 },
  { subject: "Growth", A: 75, B: 85 },
]

const radialBar = [
  { name: "Payroll", value: 80, fill: C1 },
  { name: "Suppliers", value: 65, fill: C2 },
  { name: "Rent", value: 45, fill: C3 },
  { name: "Fees", value: 30, fill: C4 },
  { name: "Other", value: 55, fill: C5 },
]

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="rounded-xl border bg-card p-4">{children}</div>
    </section>
  )
}

export default function ChartsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
      <div>
        <h1 className="text-lg font-bold text-foreground">Chart Theme Preview</h1>
        <p className="text-sm text-muted-foreground">All charts reference CSS variables directly — change globals.css to update everything.</p>
      </div>

      {/* Swatches */}
      <Section title="Color palette">
        <div className="flex gap-3">
          {[C1, C2, C3, C4, C5].map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-8 w-8 rounded-full border" style={{ background: c }} />
              <span className="text-[10px] text-muted-foreground">chart-{i + 1}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 1. Bar — single */}
      <Section title="Bar — single series">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="revenue" fill={C1} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* 2. Bar — grouped */}
      <Section title="Bar — grouped">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill={C1} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill={C2} radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill={C3} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* 3. Bar — stacked */}
      <Section title="Bar — stacked">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" stackId="a" fill={C2} />
            <Bar dataKey="profit" stackId="a" fill={C1} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* 4. Line — single */}
      <Section title="Line — single series">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke={C1} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* 5. Line — multi */}
      <Section title="Line — multiple series">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke={C1} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="expenses" stroke={C2} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="profit" stroke={C3} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* 6. Area */}
      <Section title="Area — stacked">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthly}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C1} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C1} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C2} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke={C1} fill="url(#g1)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" stroke={C2} fill="url(#g2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* 7. Pie */}
      <Section title="Pie chart">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
              {pie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Section>

      {/* 8. Donut */}
      <Section title="Donut chart">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85}>
              {pie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Section>

      {/* 9. Scatter */}
      <Section title="Scatter plot">
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="x" tick={{ fontSize: 11 }} />
            <YAxis dataKey="y" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Scatter data={scatter} fill={C1} fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </Section>

      {/* 10. Radar */}
      <Section title="Radar chart">
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radar} cx="50%" cy="50%" outerRadius={90}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            <Radar name="This year" dataKey="A" stroke={C1} fill={C1} fillOpacity={0.25} />
            <Radar name="Last year" dataKey="B" stroke={C3} fill={C3} fillOpacity={0.25} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Section>

      {/* 11. Radial bar */}
      <Section title="Radial bar chart">
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart cx="50%" cy="50%" innerRadius={30} outerRadius={110} data={radialBar}>
            <RadialBar dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 10 }} />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </Section>

      {/* 12. Composed */}
      <Section title="Composed — bar + line + reference line">
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill={C1} fillOpacity={0.8} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="expenses" fill={C2} fillOpacity={0.8} radius={[4, 4, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="profit" stroke={C4} strokeWidth={2} dot={{ r: 4 }} />
            <ReferenceLine yAxisId="left" y={1500} stroke={C5} strokeDasharray="6 3" label={{ value: "Target", fontSize: 11, fill: C5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Section>
    </div>
  )
}
