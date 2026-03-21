"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'renter' | 'landlord' | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { t, language } = useLanguage();
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const country = params.country as string;

  useEffect(() => {
    const message = searchParams.get('message');
    const redirect = searchParams.get('redirect');
    const reason = searchParams.get('reason');

    if (!redirect && message !== 'review') return;

    // Use a fixed toast ID so only one ever shows at a time
    const id = 'redirect-toast';
    if (message === 'review') {
      toast("After login you can give the review", { id, duration: 3000 });
    } else if (redirect) {
      const msg = reason === 'call'
        ? (language === 'fr' ? 'Connectez-vous pour appeler le propriétaire' : 'Login to call the owner 📞')
        : (language === 'fr' ? 'Connectez-vous pour contacter le propriétaire' : 'Login to contact the owner 🔒');
      toast(msg, { id, duration: 3000 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

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
      const success = await login(data.email, data.password, country);
      
      if (success) {
        // Reset form
        reset();
        
        // Redirect to the intended page or home after successful login
        const redirect = searchParams.get('redirect');
        setTimeout(() => {
          router.push(redirect || `/${country}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!selectedRole) {
      setShowRoleSelection(true);
      return;
    }
    googleLogin(selectedRole);
  };

  const handleRoleSelect = (role: 'renter' | 'landlord') => {
    setSelectedRole(role);
    setShowRoleSelection(false);
    // Proceed with Google login
    googleLogin(role);
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />
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

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="mt-6"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
            </motion.div>

            {/* Google Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="mt-6"
            >
              <motion.button
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
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

        {/* Role Selection Modal */}
        {showRoleSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRoleSelection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center text-primary mb-6">
                Choose Your Role
              </h3>
              <p className="text-gray-600 text-center mb-8">
                Please select whether you're looking to rent or list properties.
              </p>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('renter')}
                  className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>🏠</span>
                  I'm a Renter
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('landlord')}
                  className="w-full py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>🏢</span>
                  I'm a Landlord
                </motion.button>
              </div>
              
              <button
                onClick={() => setShowRoleSelection(false)}
                className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}