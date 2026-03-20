export type Category = 
  | "All"
  | "Chicken Meals 🍗" 
  | "Rice Dishes 🍛" 
  | "Local Meals 🍲" 
  | "Snacks 🍩" 
  | "Ice Cream 🍦" 
  | "Drinks 🥤";

export const CATEGORIES: Category[] = [
  "All",
  "Chicken Meals 🍗",
  "Rice Dishes 🍛",
  "Local Meals 🍲",
  "Snacks 🍩",
  "Ice Cream 🍦",
  "Drinks 🥤"
];

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  emoji: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // Chicken Meals
  { id: "c1", name: "Grilled Chicken (Half)", price: 2500, category: "Chicken Meals 🍗", emoji: "🍗" },
  { id: "c2", name: "Fried Chicken", price: 2000, category: "Chicken Meals 🍗", emoji: "🍗" },
  { id: "c3", name: "Peppered Chicken", price: 2800, category: "Chicken Meals 🍗", emoji: "🌶️🍗" },
  { id: "c4", name: "Chicken Suya", price: 1500, category: "Chicken Meals 🍗", emoji: "🍢" },
  
  // Rice Dishes
  { id: "r1", name: "Jollof Rice + Chicken", price: 2500, category: "Rice Dishes 🍛", emoji: "🍛" },
  { id: "r2", name: "Fried Rice + Chicken", price: 2500, category: "Rice Dishes 🍛", emoji: "🍛" },
  { id: "r3", name: "White Rice + Stew", price: 1500, category: "Rice Dishes 🍛", emoji: "🍚" },
  { id: "r4", name: "Coconut Rice", price: 2000, category: "Rice Dishes 🍛", emoji: "🥥🍚" },
  
  // Local Meals
  { id: "l1", name: "Tuwo Shinkafa + Miyan Kuka", price: 1500, category: "Local Meals 🍲", emoji: "🍲" },
  { id: "l2", name: "Tuwo + Egusi Soup", price: 1800, category: "Local Meals 🍲", emoji: "🍲" },
  { id: "l3", name: "Amala + Ewedu", price: 1500, category: "Local Meals 🍲", emoji: "🥣" },
  { id: "l4", name: "Semovita + Okra Soup", price: 1800, category: "Local Meals 🍲", emoji: "🥣" },
  
  // Snacks
  { id: "s1", name: "Meat Pie", price: 500, category: "Snacks 🍩", emoji: "🥟" },
  { id: "s2", name: "Fish Roll", price: 400, category: "Snacks 🍩", emoji: "🥐" },
  { id: "s3", name: "Puff Puff (5pcs)", price: 300, category: "Snacks 🍩", emoji: "🧆" },
  { id: "s4", name: "Spring Roll", price: 600, category: "Snacks 🍩", emoji: "🌯" },
  
  // Ice Cream
  { id: "i1", name: "Vanilla Ice Cream", price: 800, category: "Ice Cream 🍦", emoji: "🍦" },
  { id: "i2", name: "Chocolate Ice Cream", price: 800, category: "Ice Cream 🍦", emoji: "🍨" },
  { id: "i3", name: "Strawberry Ice Cream", price: 800, category: "Ice Cream 🍦", emoji: "🍧" },
  { id: "i4", name: "Mixed Flavor Scoop", price: 1000, category: "Ice Cream 🍦", emoji: "🍨" },
  
  // Drinks
  { id: "d1", name: "Coca Cola", price: 300, category: "Drinks 🥤", emoji: "🥤" },
  { id: "d2", name: "Fanta Orange", price: 300, category: "Drinks 🥤", emoji: "🧃" },
  { id: "d3", name: "Bottled Water", price: 200, category: "Drinks 🥤", emoji: "💧" },
  { id: "d4", name: "Malt Drink", price: 500, category: "Drinks 🥤", emoji: "🍺" },
];
