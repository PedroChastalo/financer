"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Camera,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  LogOut,
  Moon,
  Palette,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/modules/dashboard/components";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

function SettingItem({
  icon,
  title,
  description,
  action,
  onClick,
}: SettingItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl bg-purple-900/20 hover:bg-purple-900/30 transition-colors ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium">{title}</p>
        {description && (
          <p className="text-sm text-purple-300/60 truncate">{description}</p>
        )}
      </div>
      {action || <ChevronRight className="w-5 h-5 text-purple-300/50" />}
    </div>
  );
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);

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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Configurações
            </h1>
            <p className="text-purple-300/70">
              Personalize sua experiência no app
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-xl border-purple-400/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-600 border-2 border-purple-950 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Usuário</h2>
                    <p className="text-purple-300/70">usuario@email.com</p>
                    <Button
                      variant="link"
                      className="text-purple-400 p-0 h-auto mt-1"
                    >
                      Editar perfil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SettingItem
                    icon={<Bell className="w-5 h-5 text-purple-300" />}
                    title="Notificações Push"
                    description="Receba alertas importantes"
                    action={
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    }
                  />
                  <SettingItem
                    icon={<Shield className="w-5 h-5 text-purple-300" />}
                    title="Alertas de Orçamento"
                    description="Quando atingir o limite"
                    action={
                      <Switch
                        checked={budgetAlerts}
                        onCheckedChange={setBudgetAlerts}
                      />
                    }
                  />
                  <SettingItem
                    icon={<Bell className="w-5 h-5 text-purple-300" />}
                    title="Lembretes de Metas"
                    description="Mantenha o foco nos objetivos"
                    action={
                      <Switch
                        checked={goalReminders}
                        onCheckedChange={setGoalReminders}
                      />
                    }
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Aparência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SettingItem
                    icon={<Moon className="w-5 h-5 text-purple-300" />}
                    title="Modo Escuro"
                    description="Tema escuro ativado"
                    action={
                      <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    }
                  />
                  <SettingItem
                    icon={<Palette className="w-5 h-5 text-purple-300" />}
                    title="Tema de Cores"
                    description="Roxo"
                    onClick={() => console.log("Tema")}
                  />
                  <SettingItem
                    icon={<Globe className="w-5 h-5 text-purple-300" />}
                    title="Idioma"
                    description="Português (Brasil)"
                    onClick={() => console.log("Idioma")}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-purple-900/30 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SettingItem
                    icon={<CreditCard className="w-5 h-5 text-purple-300" />}
                    title="Assinatura"
                    description="Plano Gratuito"
                    onClick={() => console.log("Assinatura")}
                  />
                  <SettingItem
                    icon={<Shield className="w-5 h-5 text-purple-300" />}
                    title="Segurança"
                    description="Senha e autenticação"
                    onClick={() => console.log("Segurança")}
                  />
                  <SettingItem
                    icon={<HelpCircle className="w-5 h-5 text-purple-300" />}
                    title="Ajuda e Suporte"
                    description="FAQ e contato"
                    onClick={() => console.log("Ajuda")}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 h-14"
                onClick={() => console.log("Logout")}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sair da Conta
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-4"
            >
              <p className="text-purple-300/50 text-sm">Financer v1.0.0</p>
              <p className="text-purple-300/30 text-xs mt-1">
                © 2024 Todos os direitos reservados
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <BottomNav activeTab="settings" />
    </div>
  );
}
