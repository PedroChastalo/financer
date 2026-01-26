"use client";

import { motion } from "framer-motion";
import {
  Car,
  GraduationCap,
  Heart,
  Home,
  type LucideIcon,
  Plane,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Goal } from "@/shared/types";

interface GoalCardProps {
  goal: Goal;
  index?: number;
  onEdit?: (goal: Goal) => void;
  onAddAmount?: (goal: Goal) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Target,
  Car,
  Home,
  Plane,
  GraduationCap,
  Heart,
};

export function GoalCard({
  goal,
  index = 0,
  onEdit,
  onAddAmount,
}: GoalCardProps) {
  const Icon = iconMap[goal.icon] || Target;
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysUntilDeadline = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${goal.color}30`,
                  border: `1px solid ${goal.color}50`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: goal.color }} />
              </div>
              <div>
                <CardTitle className="text-white">{goal.name}</CardTitle>
                {goal.description && (
                  <p className="text-sm text-purple-300/60 mt-1">
                    {goal.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cyan-400 font-medium">
                  R$ {formatCurrency(goal.currentAmount)}
                </span>
                <span className="text-purple-300/70">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-purple-900/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-500/20">
              <div>
                <p className="text-xs text-purple-300/60">Falta</p>
                <p className="text-sm font-semibold text-white">
                  R$ {formatCurrency(remaining)}
                </p>
              </div>
              <div>
                <p className="text-xs text-purple-300/60">Meta</p>
                <p className="text-sm font-semibold text-white">
                  R$ {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300/60">
                Prazo: {formatDate(goal.deadline)}
              </span>
              <span
                className={`font-medium ${
                  daysUntilDeadline < 30 ? "text-orange-400" : "text-purple-300"
                }`}
              >
                {daysUntilDeadline > 0
                  ? `${daysUntilDeadline} dias`
                  : "Vencido"}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={() => onAddAmount?.(goal)}
              >
                Adicionar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-purple-500/30 text-purple-300"
                onClick={() => onEdit?.(goal)}
              >
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
