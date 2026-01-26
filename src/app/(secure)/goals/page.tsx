"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/modules/dashboard/components";
import { AddGoalModal, GoalCard } from "@/modules/goals/components";
import type { CreateGoalInput, Goal } from "@/shared/types";

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      if (!response.ok) throw new Error("Erro ao carregar metas");
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
    }
  };

  const handleCreateGoal = async (data: CreateGoalInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao criar meta");

      await loadGoals();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totals = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const percentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    return { totalTarget, totalCurrent, percentage };
  }, [goals]);

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
              <h1 className="text-3xl font-bold text-white mb-2">
                Metas Financeiras
              </h1>
              <p className="text-purple-300/70">
                Acompanhe o progresso dos seus objetivos
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-500 mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-xl border-purple-400/20">
              <CardHeader>
                <CardTitle className="text-white">Progresso Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-purple-300/70 text-sm">Economizado</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        R$ {formatCurrency(totals.totalCurrent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-300/70 text-sm">Meta Total</p>
                      <p className="text-2xl font-bold text-white">
                        R$ {formatCurrency(totals.totalTarget)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-purple-300/70 mb-2">
                      <span>{totals.percentage.toFixed(1)}% concluído</span>
                      <span>
                        {goals.filter((g) => g.status === "IN_PROGRESS").length}{" "}
                        metas ativas
                      </span>
                    </div>
                    <Progress value={totals.percentage} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Plus className="w-8 h-8 text-purple-400/50" />
              </div>
              <p className="text-purple-300/60 mb-4">Nenhuma meta cadastrada</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira meta
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onEdit={(g) => console.log("Editar", g)}
                  onAddAmount={(g) => console.log("Adicionar", g)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddGoalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleCreateGoal}
        isLoading={isLoading}
      />

      <BottomNav activeTab="goals" />
    </div>
  );
}
