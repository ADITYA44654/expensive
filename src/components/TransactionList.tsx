import { Transaction, CATEGORY_ICONS } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl glass p-8 text-center">
        <p className="text-muted-foreground text-sm">No transactions yet. Start adding!</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass overflow-hidden">
      <h2 className="text-lg font-semibold text-foreground p-5 pb-3">Recent Transactions</h2>
      <div className="divide-y divide-border/50">
        {transactions.slice(0, 20).map((txn) => (
          <div key={txn.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/30 transition-colors group">
            <span className="text-xl">{CATEGORY_ICONS[txn.category]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{txn.description}</p>
              <p className="text-xs text-muted-foreground">
                {txn.category} · {format(new Date(txn.date), "dd MMM yyyy")}
              </p>
            </div>
            <p className={`text-sm font-semibold ${txn.type === "income" ? "text-income" : "text-expense"}`}>
              {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
            </p>
            <button
              onClick={() => onDelete(txn.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-expense p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
