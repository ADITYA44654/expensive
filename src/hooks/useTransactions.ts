import { useState, useCallback, useMemo, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch transactions from Supabase
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        toast({ title: "Error loading transactions", description: error.message, variant: "destructive" });
      } else {
        setTransactions(
          (data || []).map((t: any) => ({
            id: t.id,
            type: t.type as Transaction["type"],
            amount: Number(t.amount),
            category: t.category as Transaction["category"],
            description: t.description,
            date: t.date,
          }))
        );
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  const addTransaction = useCallback(async (txn: Omit<Transaction, "id">) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: txn.type,
        amount: txn.amount,
        category: txn.category,
        description: txn.description || txn.category,
        date: txn.date,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error adding transaction", description: error.message, variant: "destructive" });
    } else if (data) {
      setTransactions((prev) => [
        {
          id: data.id,
          type: data.type as Transaction["type"],
          amount: Number(data.amount),
          category: data.category as Transaction["category"],
          description: data.description,
          date: data.date,
        },
        ...prev,
      ]);
    }
  }, [user]);

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting transaction", description: error.message, variant: "destructive" });
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const balance = totalIncome - totalExpense;

  const getMonthlyTransactions = useCallback(
    (month: number, year: number) =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      }),
    [transactions]
  );

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    getMonthlyTransactions,
  };
}
