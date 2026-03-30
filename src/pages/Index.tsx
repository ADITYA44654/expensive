import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import BalanceCard from "@/components/BalanceCard";
import AddTransaction from "@/components/AddTransaction";
import TransactionList from "@/components/TransactionList";
import CategoryChart from "@/components/CategoryChart";
import MonthlyReport from "@/components/MonthlyReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Clock, PieChart, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    getMonthlyTransactions,
  } = useTransactions();
  const { user, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">💰 Expense Tracker</h1>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <BalanceCard balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="w-full bg-secondary/50 glass-subtle rounded-xl p-1">
            <TabsTrigger value="add" className="flex-1 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5" /> History
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex-1 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg gap-1.5 text-xs">
              <PieChart className="w-3.5 h-3.5" /> Chart
            </TabsTrigger>
            <TabsTrigger value="report" className="flex-1 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" /> Report
            </TabsTrigger>
          </TabsList>
          <TabsContent value="add" className="mt-4">
            <AddTransaction onAdd={addTransaction} />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </TabsContent>
          <TabsContent value="chart" className="mt-4">
            <CategoryChart transactions={transactions} />
          </TabsContent>
          <TabsContent value="report" className="mt-4">
            <MonthlyReport getMonthlyTransactions={getMonthlyTransactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
