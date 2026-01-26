"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BottomNav } from "@/modules/dashboard/components";
import {
  AddTransactionModal,
  TransactionItem,
} from "@/modules/transactions/components";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
} from "@/shared/types";

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

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Assinaturas",
  "Salário",
  "Freelance",
  "Lazer",
];

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState<TransactionFilters>({
    type: undefined,
    category: undefined,
    search: "",
  });

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, selectedYear]);

  const loadTransactions = async () => {
    try {
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0);

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) throw new Error("Erro ao carregar transações");

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const matchesMonth =
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear;
      const matchesSearch =
        !filters.search ||
        t.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = !filters.type || t.type === filters.type;
      const matchesCategory =
        !filters.category || t.category === filters.category;

      return matchesMonth && matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, selectedMonth, selectedYear, filters]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const handleCreateTransaction = async (data: CreateTransactionInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao criar transação");

      await loadTransactions();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const activeFiltersCount = [filters.type, filters.category].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setFilters({ type: undefined, category: undefined, search: "" });
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#0f0520] relative overflow-hidden pb-24">
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

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Transações</h1>
              <p className="text-purple-300/70">
                Visualize e gerencie suas movimentações
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-500 mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-cyan-900/30 backdrop-blur-sm" />
              <div className="absolute inset-0 border border-cyan-400/20 rounded-2xl" />
              <div className="relative p-4">
                <p className="text-cyan-300/70 text-sm mb-1">Receitas</p>
                <p className="text-2xl font-bold text-cyan-400">
                  R$ {formatCurrency(stats.income)}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-900/30 backdrop-blur-sm" />
              <div className="absolute inset-0 border border-red-400/20 rounded-2xl" />
              <div className="relative p-4">
                <p className="text-red-300/70 text-sm mb-1">Despesas</p>
                <p className="text-2xl font-bold text-red-400">
                  R$ {formatCurrency(stats.expense)}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-sm" />
              <div className="absolute inset-0 border border-purple-400/20 rounded-2xl" />
              <div className="relative p-4">
                <p className="text-purple-300/70 text-sm mb-1">Balanço</p>
                <p
                  className={`text-2xl font-bold ${
                    stats.balance >= 0 ? "text-purple-300" : "text-orange-400"
                  }`}
                >
                  R$ {formatCurrency(Math.abs(stats.balance))}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
                  <Input
                    placeholder="Buscar transações..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="pl-10 bg-purple-900/40 border-purple-500/20 text-white placeholder:text-purple-300/50"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.type || "all"}
                  onValueChange={(v) =>
                    setFilters({
                      ...filters,
                      type:
                        v === "all" ? undefined : (v as "INCOME" | "EXPENSE"),
                    })
                  }
                >
                  <SelectTrigger className="w-[140px] bg-purple-900/40 border-purple-500/20 text-white">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-950 border-purple-500/30">
                    <SelectItem value="all" className="text-white">
                      Todos
                    </SelectItem>
                    <SelectItem value="INCOME" className="text-white">
                      Receitas
                    </SelectItem>
                    <SelectItem value="EXPENSE" className="text-white">
                      Despesas
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category || "all"}
                  onValueChange={(v) =>
                    setFilters({
                      ...filters,
                      category: v === "all" ? undefined : v,
                    })
                  }
                >
                  <SelectTrigger className="w-[160px] bg-purple-900/40 border-purple-500/20 text-white">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-950 border-purple-500/30">
                    <SelectItem value="all" className="text-white">
                      Todas
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                    className="text-purple-300 hover:bg-purple-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousMonth}
              className="text-purple-300 hover:bg-purple-500/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">
                {months[selectedMonth]} {selectedYear}
              </h3>
              <p className="text-sm text-purple-300/60">
                {filteredTransactions.length} transações
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              className="text-purple-300 hover:bg-purple-500/20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Filter className="w-8 h-8 text-purple-400/50" />
                </div>
                <p className="text-purple-300/60">
                  Nenhuma transação encontrada
                </p>
              </motion.div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                  onClick={(t) => console.log("Click", t)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AddTransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleCreateTransaction}
        accounts={[]}
        isLoading={isLoading}
      />

      <BottomNav activeTab="transactions" />
    </div>
  );
}
