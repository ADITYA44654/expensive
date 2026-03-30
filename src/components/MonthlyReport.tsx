import { useMemo, useState } from "react";
import { Transaction, CATEGORY_ICONS, Category, CATEGORY_COLORS } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthlyReportProps {
  getMonthlyTransactions: (month: number, year: number) => Transaction[];
}

export default function MonthlyReport({ getMonthlyTransactions }: MonthlyReportProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const transactions = useMemo(() => getMonthlyTransactions(month, year), [month, year, getMonthlyTransactions]);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const categoryData = useMemo(() => {
    const map = new Map<Category, number>();
    transactions.filter((t) => t.type === "expense").forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const downloadReport = () => {
    const content = [
      `Monthly Report - ${format(new Date(year, month), "MMMM yyyy")}`,
      `${"=".repeat(40)}`,
      `Total Income:  ₹${income.toLocaleString("en-IN")}`,
      `Total Expense: ₹${expense.toLocaleString("en-IN")}`,
      `Net Balance:   ₹${(income - expense).toLocaleString("en-IN")}`,
      ``,
      `Category Breakdown:`,
      ...categoryData.map((d) => `  ${CATEGORY_ICONS[d.name as Category]} ${d.name}: ₹${d.value.toLocaleString("en-IN")}`),
      ``,
      `Transactions:`,
      ...transactions.map(
        (t) =>
          `  ${format(new Date(t.date), "dd/MM")} | ${t.type === "income" ? "+" : "-"}₹${t.amount.toLocaleString("en-IN")} | ${t.category} | ${t.description}`
      ),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-report-${format(new Date(year, month), "yyyy-MM")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl glass p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Monthly Report</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadReport}
          className="border-border/50 text-muted-foreground hover:text-foreground"
        >
          <Download className="w-4 h-4 mr-1" /> Export
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button onClick={prevMonth} className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-foreground font-medium min-w-[140px] text-center">
          {format(new Date(year, month), "MMMM yyyy")}
        </span>
        <button onClick={nextMonth} className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="text-sm font-semibold text-income">₹{income.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">Expense</p>
          <p className="text-sm font-semibold text-expense">₹{expense.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground">Net</p>
          <p className={`text-sm font-semibold ${income - expense >= 0 ? "text-income" : "text-expense"}`}>
            ₹{(income - expense).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {categoryData.length > 0 && (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 10 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={80} tick={{ fill: "hsl(225 8% 52%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(225 12% 12%)",
                border: "1px solid hsl(225 10% 20%)",
                borderRadius: "12px",
                color: "hsl(210 20% 96%)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
              {categoryData.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as Category]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
