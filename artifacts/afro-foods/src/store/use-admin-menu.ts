import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addDish: (dish: Omit<AdminDish, "id" | "createdAt">) => void;
  updateDish: (id: string, dish: Omit<AdminDish, "id" | "createdAt">) => void;
  deleteDish: (id: string) => void;
}

const SEED_DISHES: AdminDish[] = [
  {
    id: "admin-seed-1",
    name: "Grilled Chicken (Half)",
    description: "Tender half chicken marinated in our signature Afro spice blend and slow-grilled to perfection.",
    price: 2500,
    category: "Main Course",
    imageUrl: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "admin-seed-2",
    name: "Jollof Rice + Chicken",
    description: "Classic smoky jollof rice cooked with tomatoes and spices, served with a piece of fried chicken.",
    price: 2500,
    category: "Main Course",
    imageUrl: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "admin-seed-3",
    name: "Meat Pie",
    description: "Freshly baked flaky pastry filled with minced beef, potatoes, and carrots.",
    price: 500,
    category: "Appetizer",
    imageUrl: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: "admin-seed-4",
    name: "Coca Cola",
    description: "Ice-cold 50cl bottle of Coca-Cola.",
    price: 300,
    category: "Drink",
    imageUrl: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

export const useAdminMenu = create<AdminMenuStore>()(
  persist(
    (set) => ({
      dishes: SEED_DISHES,
      addDish: (dish) =>
        set((state) => ({
          dishes: [
            ...state.dishes,
            { ...dish, id: `admin-${Date.now()}`, createdAt: Date.now() },
          ],
        })),
      updateDish: (id, dish) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === id ? { ...d, ...dish } : d
          ),
        })),
      deleteDish: (id) =>
        set((state) => ({
          dishes: state.dishes.filter((d) => d.id !== id),
        })),
    }),
    { name: "afro-foods-admin-menu" }
  )
);
