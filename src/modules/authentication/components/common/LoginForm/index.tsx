"use client";

import { signIn } from "@/lib/auth-client";
import {
  loginSchema,
  type LoginInput,
} from "@/modules/authentication/data/static/validators";
import { cn, parseZodErrors } from "@/shared/utils";
import { motion } from "framer-motion";
import { Lock, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      setErrors(parseZodErrors<LoginInput>(validation.error));
      setLoading(false);
      return;
    }

    const { error } = await signIn.email(
      {
        email: validation.data.email,
        password: validation.data.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setServerError(ctx.error.message || "Email ou senha inválidos");
          setLoading(false);
        },
      }
    );

    if (error) {
      setServerError(error.message || "Email ou senha inválidos");
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-900/30 backdrop-blur-xl" />
        <div className="absolute inset-0 border border-purple-400/20 rounded-3xl" />

        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/20 border border-purple-400/30 flex items-center justify-center"
            >
              <LogIn className="w-8 h-8 text-purple-300" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">
              Bem-vindo de volta
            </h1>
            <p className="text-purple-300/70 text-sm mt-1">
              Entre na sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
              >
                <p className="text-red-400 text-sm">{serverError}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-base text-purple-200">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-purple-400/50" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={loading}
                  className="w-full h-12 pl-12 pr-4 bg-purple-900/40 border border-purple-500/30 rounded-xl text-white placeholder:text-purple-400/50 focus:outline-none focus:border-purple-500/60 transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-base text-purple-200">Senha</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-purple-400/50" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  disabled={loading}
                  className="w-full h-12 pl-12 pr-4 bg-purple-900/40 border border-purple-500/30 rounded-xl text-white placeholder:text-purple-400/50 focus:outline-none focus:border-purple-500/60 transition-colors"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </motion.button>

            <p className="text-center text-purple-300/70 text-sm">
              Ainda não tem uma conta?{" "}
              <a
                href="/signup"
                className="text-purple-300 hover:text-purple-200 underline underline-offset-4 transition-colors"
              >
                Cadastrar
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
