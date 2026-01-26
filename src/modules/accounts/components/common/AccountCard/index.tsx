"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  type LucideIcon,
  MoreVertical,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Account, AccountType } from "@/shared/types";

interface AccountCardProps {
  account: Account;
  hideBalance?: boolean;
  index?: number;
  onEdit?: (account: Account) => void;
  onArchive?: (account: Account) => void;
  onAdjustBalance?: (account: Account) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  DollarSign,
};

const typeLabels: Record<AccountType, string> = {
  CHECKING: "Conta Corrente",
  SAVINGS: "Poupança",
  CASH: "Dinheiro",
  CREDIT: "Cartão de Crédito",
  INVESTMENT: "Investimento",
};

export function AccountCard({
  account,
  hideBalance = false,
  index = 0,
  onEdit,
  onArchive,
  onAdjustBalance,
}: AccountCardProps) {
  const Icon = iconMap[account.icon] || Wallet;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all group">
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: `${account.color}30`,
                border: `1px solid ${account.color}50`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color: account.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{account.name}</h3>
              <p className="text-xs text-purple-300/60">
                {typeLabels[account.type]}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-purple-950 border-purple-500/30"
            >
              <DropdownMenuItem
                className="text-white hover:bg-purple-500/20"
                onClick={() => onEdit?.(account)}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:bg-purple-500/20"
                onClick={() => onAdjustBalance?.(account)}
              >
                Ajustar saldo
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 hover:bg-red-500/20"
                onClick={() => onArchive?.(account)}
              >
                Arquivar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-purple-300/60 mb-1">
                {account.type === "CREDIT" ? "Fatura Atual" : "Saldo"}
              </p>
              <p
                className={`text-2xl font-bold ${
                  account.balance >= 0 ? "text-white" : "text-red-400"
                }`}
              >
                {hideBalance
                  ? "••••••"
                  : `R$ ${formatCurrency(Math.abs(account.balance))}`}
              </p>
            </div>

            {account.type === "CREDIT" && account.creditLimit && (
              <div className="pt-3 border-t border-purple-500/20">
                <div className="flex justify-between text-xs text-purple-300/60 mb-1">
                  <span>Limite disponível</span>
                  <span>
                    {hideBalance
                      ? "••••••"
                      : `R$ ${formatCurrency(
                          account.creditLimit + account.balance,
                        )}`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-purple-900/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                    style={{
                      width: `${
                        (Math.abs(account.balance) / account.creditLimit) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-purple-300/60 mt-2">
                  Fecha dia {account.closingDay} • Vence dia {account.dueDay}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
