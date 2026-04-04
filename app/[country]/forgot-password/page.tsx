"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "@/components/LocalizedLink";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const params = useParams();
  const country = params.country as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, country }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset link');
      }

      setIsSuccess(true);
      toast.success("Reset link sent! Check your email.");
      reset();
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 md:p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5"
            >
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Check Your Email</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              We've sent a password reset link to <strong>{getValues("email")}</strong>
            </p>
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-gray-500">Didn't receive the email? Check your spam folder or try again.</p>
              <div className="flex gap-3">
                <motion.button onClick={() => setIsSuccess(false)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base">
                  Try Again
                </motion.button>
                <Link href={`/${country}/login`} className="flex-1">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors text-sm sm:text-base">
                    Back to Login
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div 
        className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 md:p-8">
            <Link
              href={`/login`}
              className="inline-flex items-center text-primary hover:text-primary-dark mb-4 sm:mb-5 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {t("forgot.backToLogin")}
            </Link>

            <div className="text-center mb-5 sm:mb-7">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1.5">
                {t("forgot.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {t("forgot.subtitle")}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-5 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("forgot.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    disabled={isLoading}
                    className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t("placeholder.email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="w-full py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />Sending...</>
                ) : t("forgot.button")}
              </motion.button>
            </form>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-4 sm:mt-5 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Remember your password?{" "}
                <Link href={`/login`} className="text-primary font-semibold hover:text-primary-dark transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
