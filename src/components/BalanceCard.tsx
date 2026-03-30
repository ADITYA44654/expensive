import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export default function BalanceCard({ balance, totalIncome, totalExpense }: BalanceCardProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl glass p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Wallet className="w-4 h-4" />
            Total Balance
          </div>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            ₹{balance.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl glass p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <ArrowDownLeft className="w-4 h-4 text-income" />
            Income
          </div>
          <p className="text-xl font-semibold text-income">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl glass p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <ArrowUpRight className="w-4 h-4 text-expense" />
            Expense
          </div>
          <p className="text-xl font-semibold text-expense">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}
