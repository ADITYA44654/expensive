import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TransactionType,
  Category,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_ICONS,
  Transaction,
} from "@/lib/types";
import { Plus, Loader2 } from "lucide-react";

interface AddTransactionProps {
  onAdd: (txn: Omit<Transaction, "id">) => void;
}

export default function AddTransaction({ onAdd }: AddTransactionProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    setSubmitting(true);
    await onAdd({
      type,
      amount: parseFloat(amount),
      category: category as Category,
      description: description || category,
      date: new Date().toISOString(),
    });

    setAmount("");
    setCategory("");
    setDescription("");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl glass p-5 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Add Transaction</h2>

      {/* Type Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-secondary/50">
        <button
          type="button"
          onClick={() => { setType("income"); setCategory(""); }}
          className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
            type === "income"
              ? "bg-income text-income-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          + Income
        </button>
        <button
          type="button"
          onClick={() => { setType("expense"); setCategory(""); }}
          className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
            type === "expense"
              ? "bg-expense text-expense-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          - Expense
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-muted-foreground text-xs">Amount (₹)</Label>
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            className="mt-1 bg-secondary/50 border-border/50 text-foreground text-lg font-semibold placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <Label className="text-muted-foreground text-xs">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger className="mt-1 bg-secondary/50 border-border/50 text-foreground">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-muted-foreground text-xs">Description (optional)</Label>
          <Input
            placeholder="What was it for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!amount || !category || submitting}
        className="w-full font-semibold"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add {type === "income" ? "Income" : "Expense"}
          </>
        )}
      </Button>
    </form>
  );
}
