"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AddBudgetModal, BudgetCard } from "@/modules/budgets/components";
import { BottomNav } from "@/modules/dashboard/components";
import type { Budget, CreateBudgetInput } from "@/shared/types";

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Erro ao carregar orçamentos");
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
    }
  };

  const handleCreateBudget = async (data: CreateBudgetInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao criar orçamento");

      await loadBudgets();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totals = useMemo(() => {
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    return { totalBudget, totalSpent, percentage };
  }, [budgets]);

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Orçamentos</h1>
              <p className="text-purple-300/70">
                Controle seus gastos por categoria
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-500 mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-xl border-purple-400/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Resumo Geral -{" "}
                  {new Date().toLocaleString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-purple-300/70 text-sm">Total Orçado</p>
                      <p className="text-2xl font-bold text-white">
                        R$ {formatCurrency(totals.totalBudget)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-300/70 text-sm">Total Gasto</p>
                      <p className="text-2xl font-bold text-red-400">
                        R$ {formatCurrency(totals.totalSpent)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-purple-300/70 mb-2">
                      <span>{totals.percentage.toFixed(1)}% utilizado</span>
                      <span>
                        R${" "}
                        {formatCurrency(totals.totalBudget - totals.totalSpent)}{" "}
                        restante
                      </span>
                    </div>
                    <Progress value={totals.percentage} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {budgets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Plus className="w-8 h-8 text-purple-400/50" />
              </div>
              <p className="text-purple-300/60 mb-4">
                Nenhum orçamento cadastrado
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar primeiro orçamento
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgets.map((budget, index) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  index={index}
                  onClick={(b) => console.log("Click", b)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddBudgetModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleCreateBudget}
        isLoading={isLoading}
      />

      <BottomNav activeTab="budgets" />
    </div>
  );
}
