"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Home,
  type LucideIcon,
  PieChart,
  Settings,
  Target,
  Wallet,
} from "lucide-react";
import Link from "next/link";

interface Tab {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string;
}

interface BottomNavProps {
  activeTab?: string;
}

const tabs: Tab[] = [
  { id: "home", icon: Home, label: "Início", href: "/dashboard" },
  { id: "accounts", icon: Wallet, label: "Contas", href: "/accounts" },
  {
    id: "transactions",
    icon: ArrowLeftRight,
    label: "Transações",
    href: "/transactions",
  },
  { id: "budgets", icon: PieChart, label: "Orçamentos", href: "/budgets" },
  { id: "goals", icon: Target, label: "Metas", href: "/goals" },
  { id: "settings", icon: Settings, label: "Config", href: "/settings" },
];

export function BottomNav({ activeTab = "home" }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0f0520] via-[#0f0520]/95 to-transparent pointer-events-none h-24"
        style={{ bottom: "-20px" }}
      />

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="relative mx-4 mb-4"
      >
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-purple-950/80 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-purple-500/30 rounded-3xl" />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="relative flex items-center justify-around py-3 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <Link key={tab.id} href={tab.href}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="relative flex flex-col items-center gap-1 px-3 py-2"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-purple-700/20 rounded-2xl border border-purple-500/30"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}

                    <Icon
                      className={`w-5 h-5 relative z-10 transition-colors ${
                        isActive ? "text-purple-300" : "text-purple-400/50"
                      }`}
                    />
                    <span
                      className={`text-[10px] relative z-10 transition-colors ${
                        isActive ? "text-purple-200" : "text-purple-400/50"
                      }`}
                    >
                      {tab.label}
                    </span>

                    {isActive && (
                      <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
