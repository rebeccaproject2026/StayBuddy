"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const params = useParams();
  const country = params.country as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        // Reset form
        reset();
        
        // Redirect to home page after successful login
        setTimeout(() => {
          router.push(`/${country}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-12 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-xl relative z-10"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-3xl font-bold text-primary mb-2"
              >
                {t("login.title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-gray-600"
              >
                {t("login.subtitle")}
              </motion.p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t("placeholder.email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t("placeholder.password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register("rememberMe")}
                    type="checkbox"
                    disabled={isLoading}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">{t("login.rememberMe")}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-300"
                >
                  {t("login.forgotPassword")}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === 'fr' ? 'Connexion...' : 'Signing in...'}
                    </>
                  ) : (
                    t("login.button")
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600">
                {t("login.noAccount")}{" "}
                <Link
                  href="/signup"
                  className="text-primary font-semibold hover:text-primary-dark transition-colors duration-300"
                >
                  {t("login.signupLink")}
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}