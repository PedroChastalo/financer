"use client";

import { motion } from "framer-motion";
import { Banknote, Car, Utensils } from "lucide-react";

interface SavingsCardProps {
  savingsProgress?: number;
  revenueLastWeek: number;
  expenseLastWeek: number;
}

export function SavingsCard({
  savingsProgress,
  revenueLastWeek,
  expenseLastWeek,
}: SavingsCardProps) {
  const progress = savingsProgress || 65;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="mx-6 my-4"
    >
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-purple-400/20 rounded-3xl" />

        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-28 h-28 -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  stroke="rgba(168, 85, 247, 0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="45"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                  strokeDasharray={circumference}
                />
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/20 border border-purple-400/30 flex items-center justify-center">
                  <Car className="w-6 h-6 text-purple-300" />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-500/20">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Banknote className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-purple-300/60 text-xs">
                    Receita da Semana
                  </p>
                  <p className="text-white font-bold text-lg">
                    R${" "}
                    {revenueLastWeek?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    }) || "4.000,00"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-purple-300/60 text-xs">
                    Alimentação Semana
                  </p>
                  <p className="text-red-400 font-bold text-lg">
                    -R${" "}
                    {expenseLastWeek?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    }) || "100,00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-purple-300/70 text-sm">Economia em Metas</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
