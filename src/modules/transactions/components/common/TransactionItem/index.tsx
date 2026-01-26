"use client";

import { motion } from "framer-motion";
import {
  Banknote,
  Briefcase,
  Car,
  Coffee,
  Home,
  type LucideIcon,
  ShoppingCart,
  Zap,
} from "lucide-react";
import type { Transaction } from "@/shared/types";

interface TransactionItemProps {
  transaction: Transaction;
  index?: number;
  onClick?: (transaction: Transaction) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Banknote,
  ShoppingCart,
  Home,
  Briefcase,
  Coffee,
  Car,
  Zap,
};

const categoryColors: Record<string, string> = {
  Salário: "from-cyan-500/30 to-cyan-600/20 border-cyan-500/30",
  Freelance: "from-purple-500/30 to-purple-600/20 border-purple-500/30",
  Alimentação: "from-orange-500/30 to-orange-600/20 border-orange-500/30",
  Moradia: "from-blue-500/30 to-blue-600/20 border-blue-500/30",
  Transporte: "from-indigo-500/30 to-indigo-600/20 border-indigo-500/30",
  Saúde: "from-teal-500/30 to-teal-600/20 border-teal-500/30",
  Assinaturas: "from-pink-500/30 to-pink-600/20 border-pink-500/30",
  Lazer: "from-purple-500/30 to-purple-600/20 border-purple-500/30",
  default: "from-purple-500/30 to-purple-600/20 border-purple-500/30",
};

const iconColors: Record<string, string> = {
  Salário: "text-cyan-400",
  Freelance: "text-purple-400",
  Alimentação: "text-orange-400",
  Moradia: "text-blue-400",
  Transporte: "text-indigo-400",
  Saúde: "text-teal-400",
  Assinaturas: "text-pink-400",
  Lazer: "text-purple-400",
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

export function TransactionItem({
  transaction,
  index = 0,
  onClick,
}: TransactionItemProps) {
  const colorClass =
    categoryColors[transaction.category] || categoryColors.default;
  const iconColor = iconColors[transaction.category] || iconColors.default;
  const Icon = iconMap.Banknote;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
    ).padStart(2, "0")} - ${date.getDate()} ${months[date.getMonth()].slice(
      0,
      3,
    )}`;
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => onClick?.(transaction)}
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

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">
              {transaction.description}
            </h3>
            <p className="text-purple-300/60 text-xs">
              {formatDate(transaction.date)}
            </p>
          </div>

          <div className="text-purple-300/60 text-sm px-3 hidden sm:block">
            {transaction.category}
          </div>

          <div className="w-px h-8 bg-purple-500/30 hidden sm:block" />

          <div className="min-w-[100px] text-right">
            <p
              className={`font-bold text-lg ${
                transaction.type === "INCOME" ? "text-cyan-400" : "text-red-400"
              }`}
            >
              {transaction.type === "INCOME" ? "" : "-"}R${" "}
              {formatCurrency(transaction.amount)}
            </p>
            {transaction.installmentNumber && transaction.installmentTotal && (
              <p className="text-purple-300/50 text-xs">
                {transaction.installmentNumber}/{transaction.installmentTotal}x
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
