"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface GoalProgressProps {
  current: number;
  goal: number;
  percentage?: number;
}

export function GoalProgress({ current, goal, percentage }: GoalProgressProps) {
  const calculatedPercentage =
    percentage || (goal > 0 ? Math.round((current / goal) * 100) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-6 py-4"
    >
      <div className="relative">
        <div className="h-10 rounded-full bg-purple-900/40 border border-purple-500/20 overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(calculatedPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-300/30 to-purple-400/0" />
          </motion.div>

          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30">
            <span className="text-purple-200 text-sm font-semibold">
              {calculatedPercentage}%
            </span>
          </div>

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="text-purple-200/80 text-sm font-medium">
              R${" "}
              {goal?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ||
                "0,00"}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 mt-3"
      >
        <CheckCircle2
          className={`w-4 h-4 ${
            calculatedPercentage <= 30
              ? "text-cyan-400"
              : calculatedPercentage <= 60
              ? "text-purple-400"
              : "text-orange-400"
          }`}
        />
        <span className="text-purple-300/70 text-sm">
          {calculatedPercentage <= 30
            ? `${calculatedPercentage}% das suas despesas. Ótimo controle!`
            : calculatedPercentage <= 60
            ? "Mantenha o foco no seu objetivo!"
            : "Atenção: revise seus gastos."}
        </span>
      </motion.div>
    </motion.div>
  );
}
