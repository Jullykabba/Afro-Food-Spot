import { create } from "zustand";

export type AdminCategory = "Appetizer" | "Main Course" | "Drink";

export interface AdminDish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: AdminCategory;
  imageUrl: string;
  createdAt: number;
}

interface AdminMenuStore {
  dishes: AdminDish[];
  addDish:    (dish: Omit<AdminDish, "id" | "createdAt">) => void;
  updateDish: (id: string, dish: Omit<AdminDish, "id" | "createdAt">) => void;
  deleteDish: (id: string) => void;
}

const STORAGE_KEY = "afro-foods-admin-dishes";

const SEED: AdminDish[] = [
  {
    id: "seed-1",
    name: "Grilled Chicken (Half)",
    description: "Tender half chicken marinated in our signature Afro spice blend and slow-grilled to perfection.",
    price: 2500,
    category: "Main Course",
    imageUrl: "",
    createdAt: 1,
  },
  {
    id: "seed-2",
    name: "Jollof Rice + Chicken",
    description: "Classic smoky jollof rice cooked with tomatoes and spices, served with a piece of fried chicken.",
    price: 2500,
    category: "Main Course",
    imageUrl: "",
    createdAt: 2,
  },
  {
    id: "seed-3",
    name: "Meat Pie",
    description: "Freshly baked flaky pastry filled with minced beef, potatoes, and carrots.",
    price: 500,
    category: "Appetizer",
    imageUrl: "",
    createdAt: 3,
  },
  {
    id: "seed-4",
    name: "Coca Cola",
    description: "Ice-cold 50cl bottle of Coca-Cola.",
    price: 300,
    category: "Drink",
    imageUrl: "",
    createdAt: 4,
  },
];

function load(): AdminDish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return SEED;
}

function save(dishes: AdminDish[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  } catch {
    // ignore
  }
}

export const useAdminMenu = create<AdminMenuStore>((set) => ({
  dishes: load(),

  addDish: (dish) =>
    set((state) => {
      const next: AdminDish = {
        ...dish,
        id: `dish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      const updated = [...state.dishes, next];
      save(updated);
      return { dishes: updated };
    }),

  updateDish: (id, dish) =>
    set((state) => {
      const updated = state.dishes.map((d) =>
        d.id === id ? { ...d, ...dish } : d
      );
      save(updated);
      return { dishes: updated };
    }),

  deleteDish: (id) =>
    set((state) => {
      const updated = state.dishes.filter((d) => d.id !== id);
      save(updated);
      return { dishes: updated };
    }),
}));
