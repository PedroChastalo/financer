"use client";

import { motion } from "framer-motion";
import { Bell, TrendingDown, Wallet } from "lucide-react";

interface BalanceHeaderProps {
  userName?: string;
  totalBalance: number;
  totalExpense: number;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom Dia";
  if (hour < 18) return "Boa Tarde";
  return "Boa Noite";
}

export function BalanceHeader({
  userName,
  totalBalance,
  totalExpense,
}: BalanceHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-8 pb-4"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {userName || "Usuário"}
          </h1>
          <p className="text-purple-300/70 text-sm">{getGreeting()}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm"
        >
          <Bell className="w-5 h-5 text-purple-300" />
        </motion.button>
      </div>

      <div className="flex gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-purple-300/60 text-xs">Saldo Total</span>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
            R${" "}
            {totalBalance?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            }) || "0,00"}
          </p>
        </motion.div>

        <div className="w-px bg-purple-500/30" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center">
              <TrendingDown className="w-3 h-3 text-red-400" />
            </div>
            <span className="text-purple-300/60 text-xs">Total Despesas</span>
          </div>
          <p className="text-2xl font-bold text-red-400">
            -R${" "}
            {totalExpense?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            }) || "0,00"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
