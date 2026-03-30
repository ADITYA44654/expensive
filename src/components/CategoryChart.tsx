import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Transaction, CATEGORY_COLORS, Category } from "@/lib/types";
import { useMemo } from "react";

interface CategoryChartProps {
  transactions: Transaction[];
}

export default function CategoryChart({ transactions }: CategoryChartProps) {
  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const map = new Map<Category, number>();
    expenses.forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl glass p-8 text-center">
        <p className="text-muted-foreground text-sm">Add expenses to see the chart</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass p-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">Expense Breakdown</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as Category]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(225 12% 12%)",
              border: "1px solid hsl(225 10% 20%)",
              borderRadius: "12px",
              color: "hsl(210 20% 96%)",
              fontSize: "13px",
              backdropFilter: "blur(8px)",
            }}
            formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: CATEGORY_COLORS[d.name as Category] }}
            />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
