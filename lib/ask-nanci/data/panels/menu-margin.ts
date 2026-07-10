export const MENU_ITEMS = [
  { name: "Italian Combo", unitsSold: 840, salesAmount: 7140.0, margin: 2.9 },
  { name: "Turkey Club", unitsSold: 610, salesAmount: 5185.0, margin: 3.2 },
  { name: "Meatball Sub", unitsSold: 545, salesAmount: 4632.5, margin: 2.4 },
  { name: "Chicken Pesto", unitsSold: 390, salesAmount: 3510.0, margin: 4.6 },
  { name: "Veggie Wrap", unitsSold: 265, salesAmount: 1987.5, margin: 3.8 },
] as const

export const HERO_ITEM = "Italian Combo"

export const COMBO_COST_BREAKDOWN = [
  { ingredient: "Prosciutto", cost: 2.05 },
  { ingredient: "Mortadella", cost: 1.31 },
  { ingredient: "Other (produce, oil, packaging)", cost: 1.14 },
  { ingredient: "Provolone", cost: 0.68 },
  { ingredient: "Bread", cost: 0.42 },
] as const

export const COMBO_MENU_PRICE = 8.5
export const COMBO_TOTAL_INGREDIENT_COST = 5.6
export const COMBO_MARGIN = 2.9
