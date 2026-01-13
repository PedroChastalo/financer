"use client";

import { useEffect, useState } from "react";
import {
  BalanceHeader,
  BottomNav,
  GoalProgress,
  SavingsCard,
  type Transaction,
  TransactionList,
} from "@/modules/dashboard/components";

interface FinanceData {
  totalBalance: number;
  totalExpense: number;
  goal: number;
  savingsProgress: number;
  revenueLastWeek: number;
  expenseLastWeek: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financeData, setFinanceData] = useState<FinanceData>({
    totalBalance: 0,
    totalExpense: 0,
    goal: 0,
    savingsProgress: 0,
    revenueLastWeek: 0,
    expenseLastWeek: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error("Erro ao carregar dados");

        const data = await response.json();
        setTransactions(data.transactions);
        setFinanceData(data.summary);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const percentage =
    financeData.goal > 0
      ? Math.round((financeData.totalExpense / financeData.goal) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#0f0520] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, purple 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10">
        <BalanceHeader
          totalBalance={financeData.totalBalance}
          totalExpense={financeData.totalExpense}
        />

        <GoalProgress
          current={financeData.totalExpense}
          goal={financeData.goal}
          percentage={percentage}
        />

        <SavingsCard
          savingsProgress={financeData.savingsProgress}
          revenueLastWeek={financeData.revenueLastWeek}
          expenseLastWeek={financeData.expenseLastWeek}
        />

        <TransactionList transactions={transactions} />
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
