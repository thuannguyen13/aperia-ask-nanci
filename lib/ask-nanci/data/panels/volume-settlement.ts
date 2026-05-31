export const BARS = [
  { label: "Feb", w1: 8,  w2: 7,  w3: 9,  w4: 8  },
  { label: "Mar", w1: 10, w2: 11, w3: 13, w4: 18 },
  { label: "Apr", w1: 24, w2: 31, w3: 38, w4: 45 },
]

export const FLAT_BARS = BARS.flatMap(m => [
  { label: m.label, week: "W1", val: m.w1 },
  { label: "",      week: "W2", val: m.w2 },
  { label: "",      week: "W3", val: m.w3 },
  { label: "",      week: "W4", val: m.w4 },
])

export const MAX = 45
