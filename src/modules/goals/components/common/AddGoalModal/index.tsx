"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateGoalInput } from "@/shared/types";

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateGoalInput) => Promise<void>;
  isLoading?: boolean;
}

const icons = ["Target", "Car", "Home", "Plane", "GraduationCap", "Heart"];
const colors = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
];

export function AddGoalModal({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: AddGoalModalProps) {
  const [formData, setFormData] = useState<CreateGoalInput>({
    name: "",
    description: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    icon: icons[0],
    color: colors[0],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({
      name: "",
      description: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      icon: icons[0],
      color: colors[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0520] border-purple-500/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Nova Meta
          </DialogTitle>
          <p className="text-purple-300/70 text-sm">
            Defina um novo objetivo financeiro
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label className="text-base text-purple-200">Nome da Meta</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Carro Novo, Viagem, Reserva de Emergência"
              className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 h-12"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div>
            <Label className="text-base text-purple-200">
              Descrição (opcional)
            </Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descreva seu objetivo..."
              className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base text-purple-200">Valor da Meta</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.targetAmount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAmount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 h-12 text-lg font-semibold"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label className="text-base text-purple-200">Valor Inicial</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.currentAmount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentAmount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                className="bg-purple-900/40 border-purple-500/30 text-white placeholder:text-purple-400/50 mt-2 h-12"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label className="text-base text-purple-200">Prazo</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="bg-purple-900/40 border-purple-500/30 text-white mt-2 h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label className="text-base text-purple-200">Cor</Label>
            <div className="flex gap-3 mt-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-xl border-2 ${
                    formData.color === color
                      ? "border-white scale-110 shadow-lg"
                      : "border-purple-500/30"
                  } transition-all hover:scale-105`}
                  style={{ backgroundColor: color }}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 h-12"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 h-12"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
