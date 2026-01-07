"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Briefcase,
  Car,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Home,
  LucideIcon,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface Transaction {
  id: number;
  title: string;
  date: string;
  category: string;
  type: string;
  amount: number;
  isIncome: boolean;
}

interface TransactionListProps {
  transactions?: Transaction[];
}

const iconMap: Record<string, LucideIcon> = {
  salary: Banknote,
  groceries: ShoppingCart,
  rent: Home,
  work: Briefcase,
  food: Coffee,
  transport: Car,
  utilities: Zap,
  default: Banknote,
};

const categoryColors: Record<string, string> = {
  salary: "from-cyan-500/30 to-cyan-600/20 border-cyan-500/30",
  groceries: "from-orange-500/30 to-orange-600/20 border-orange-500/30",
  rent: "from-blue-500/30 to-blue-600/20 border-blue-500/30",
  work: "from-purple-500/30 to-purple-600/20 border-purple-500/30",
  food: "from-yellow-500/30 to-yellow-600/20 border-yellow-500/30",
  transport: "from-indigo-500/30 to-indigo-600/20 border-indigo-500/30",
  utilities: "from-red-500/30 to-red-600/20 border-red-500/30",
  default: "from-purple-500/30 to-purple-600/20 border-purple-500/30",
};

const iconColors: Record<string, string> = {
  salary: "text-cyan-400",
  groceries: "text-orange-400",
  rent: "text-blue-400",
  work: "text-purple-400",
  food: "text-yellow-400",
  transport: "text-indigo-400",
  utilities: "text-red-400",
  default: "text-purple-400",
};

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function TransactionList({ transactions }: TransactionListProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const allTransactions = transactions || [];

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });
  }, [allTransactions, selectedMonth, selectedYear]);

  const monthlyTotals = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter((t) => !t.isIncome)
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  }, [filteredTransactions]);

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")} - ${date.getDate()} ${months[date.getMonth()].slice(
      0,
      3
    )}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="px-6 pt-4 pb-24"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between p-1.5 bg-purple-900/40 rounded-2xl border border-purple-500/20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goToPreviousMonth}
            className="w-10 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-purple-300" />
          </motion.button>

          <div className="flex-1 text-center">
            <motion.h3
              key={`${selectedMonth}-${selectedYear}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold text-white"
            >
              {months[selectedMonth]}
            </motion.h3>
            <p className="text-purple-300/60 text-xs">{selectedYear}</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goToNextMonth}
            className="w-10 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-purple-300" />
          </motion.button>
        </div>

        <motion.div
          key={`summary-${selectedMonth}-${selectedYear}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-sm" />
          <div className="absolute inset-0 border border-purple-400/20 rounded-2xl" />

          <div className="relative p-4 grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                <p className="text-purple-300/60 text-xs">Receitas</p>
              </div>
              <p className="text-cyan-400 font-bold text-lg">
                R${" "}
                {monthlyTotals.income.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="border-l border-r border-purple-500/30 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <p className="text-purple-300/60 text-xs">Despesas</p>
              </div>
              <p className="text-red-400 font-bold text-lg">
                R${" "}
                {monthlyTotals.expenses.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="text-center">
              <p className="text-purple-300/60 text-xs mb-1">Balanço</p>
              <p
                className={`font-bold text-lg ${
                  monthlyTotals.balance >= 0
                    ? "text-purple-300"
                    : "text-orange-400"
                }`}
              >
                R${" "}
                {Math.abs(monthlyTotals.balance).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Banknote className="w-8 h-8 text-purple-400/50" />
            </div>
            <p className="text-purple-300/60">Nenhuma transação neste mês</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredTransactions.map((transaction, index) => {
              const Icon = iconMap[transaction.category] || iconMap.default;
              const colorClass =
                categoryColors[transaction.category] || categoryColors.default;
              const iconColor =
                iconColors[transaction.category] || iconColors.default;

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-sm group-hover:bg-purple-900/40 transition-colors" />
                    <div className="absolute inset-0 border border-purple-500/20 rounded-2xl group-hover:border-purple-500/30 transition-colors" />

                    <div className="relative p-4 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} border flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {transaction.title}
                        </h3>
                        <p className="text-purple-300/60 text-xs">
                          {formatDate(transaction.date)}
                        </p>
                      </div>

                      <div className="text-purple-300/60 text-sm px-3">
                        {transaction.type}
                      </div>

                      <div className="w-px h-8 bg-purple-500/30" />

                      <div className="min-w-[100px] text-right">
                        <p
                          className={`font-bold text-lg ${
                            transaction.isIncome
                              ? "text-cyan-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.isIncome ? "" : "-"}R${" "}
                          {transaction.amount?.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
