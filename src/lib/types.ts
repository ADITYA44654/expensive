export type TransactionType = "income" | "expense";

export type Category =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Salary"
  | "Freelance"
  | "Other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO string
}

export const EXPENSE_CATEGORIES: Category[] = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

export const INCOME_CATEGORIES: Category[] = ["Salary", "Freelance", "Other"];

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "📄",
  Entertainment: "🎬",
  Health: "💊",
  Salary: "💰",
  Freelance: "💻",
  Other: "📦",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#FF6B6B",
  Travel: "#4ECDC4",
  Shopping: "#FFE66D",
  Bills: "#A78BFA",
  Entertainment: "#F472B6",
  Health: "#34D399",
  Salary: "#60A5FA",
  Freelance: "#FBBF24",
  Other: "#94A3B8",
};
