"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Budget } from "@/shared/types";

interface BudgetCardProps {
  budget: Budget;
  index?: number;
  onClick?: (budget: Budget) => void;
}

export function BudgetCard({ budget, index = 0, onClick }: BudgetCardProps) {
  const percentage = (budget.spent / budget.amount) * 100;
  const isNearLimit = percentage >= budget.alertThreshold;
  const isOverLimit = percentage >= 100;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick?.(budget)}
      className="cursor-pointer"
    >
      <Card
        className={`bg-purple-900/30 backdrop-blur-sm border-purple-500/20 ${
          isOverLimit
            ? "ring-2 ring-red-500/50"
            : isNearLimit
              ? "ring-2 ring-orange-500/50"
              : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {budget.category}
                {isOverLimit && (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                {isNearLimit && !isOverLimit && (
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                )}
              </CardTitle>
              <p className="text-sm text-purple-300/60 mt-1">Limite mensal</p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${budget.color}30`,
                border: `1px solid ${budget.color}50`,
              }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: budget.color }} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-xs text-purple-300/60">Gasto</p>
                <p
                  className={`text-2xl font-bold ${
                    isOverLimit ? "text-red-400" : "text-white"
                  }`}
                >
                  R$ {formatCurrency(budget.spent)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-300/60">Limite</p>
                <p className="text-xl font-semibold text-purple-300">
                  R$ {formatCurrency(budget.amount)}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span
                  className={`font-medium ${
                    isOverLimit
                      ? "text-red-400"
                      : isNearLimit
                        ? "text-orange-400"
                        : "text-purple-300"
                  }`}
                >
                  {percentage.toFixed(1)}%
                </span>
                <span className="text-purple-300/60">
                  R$ {formatCurrency(budget.amount - budget.spent)} restante
                </span>
              </div>
              <div className="h-2 bg-purple-900/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    isOverLimit
                      ? "bg-gradient-to-r from-red-600 to-red-400"
                      : isNearLimit
                        ? "bg-gradient-to-r from-orange-600 to-orange-400"
                        : "bg-gradient-to-r from-purple-600 to-purple-400"
                  }`}
                />
              </div>
            </div>

            {isOverLimit && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Orçamento estourado! Revise seus gastos.
              </p>
            )}
            {isNearLimit && !isOverLimit && (
              <p className="text-xs text-orange-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Atenção! Você atingiu {budget.alertThreshold}% do limite.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
