"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Lock, Home, Users, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import toast, { Toaster } from 'react-hot-toast';

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please provide a valid phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  role: z.enum(["renter", "landlord"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const params = useParams();
  const country = params.country as string;
  
  const [selectedRole, setSelectedRole] = useState<"renter" | "landlord">("renter");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "renter",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      const signupData = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
        country: country === 'fr' ? 'fr' : 'in',
      };

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();

      if (response.ok) {
        reset();
        setPassword("");
        setConfirmPassword("");
        router.push(`/${country}/verify-otp?email=${encodeURIComponent(data.email)}`);

      } else {
        if (result.details && Array.isArray(result.details)) {
          result.details.forEach((detail: any) => {
            toast.error(`${detail.field}: ${detail.message}`, {
              duration: 3000,
              position: 'top-center',
            });
          });
        } else {
          toast.error(
            result.error || (language === 'fr' ? 'Erreur lors de la création du compte' : 'Failed to create account'),
            {
              duration: 3000,
              position: 'top-center',
              style: {
                background: '#EF4444',
                color: 'white',
                fontWeight: '500',
              },
            }
          );
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(
        language === 'fr' 
          ? 'Erreur de connexion. Veuillez réessayer.' 
          : 'Connection error. Please try again.',
        {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: 'white',
            fontWeight: '500',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: "renter" | "landlord") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const roles = [
    {
      value: "renter" as const,
      label: t("signup.tenant"),
      icon: Users,
      description: t("signup.tenantDesc"),
    },
    {
      value: "landlord" as const,
      label: t("signup.owner"),
      icon: Home,
      description: t("signup.ownerDesc"),
    },
  ];

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  const content = {
    en: {
      passwordRequirements: "Password Requirements:",
      requirement1: "At least 8 characters",
      requirement2: "One uppercase letter",
      requirement3: "One lowercase letter",
      requirement4: "One number",
      passwordMatch: "Passwords match",
      passwordNoMatch: "Passwords do not match",
    },
    fr: {
      passwordRequirements: "Exigences du mot de passe:",
      requirement1: "Au moins 8 caractères",
      requirement2: "Une lettre majuscule",
      requirement3: "Une lettre minuscule",
      requirement4: "Un chiffre",
      passwordMatch: "Les mots de passe correspondent",
      passwordNoMatch: "Les mots de passe ne correspondent pas",
    },
  };

  const tc = content[language];

  return (
    <>
      <Toaster />
      <div
        className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/homebg.jpeg')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-3xl relative z-10"
        >
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 md:p-8">
            <div className="text-center mb-5 sm:mb-7">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-2xl sm:text-3xl font-bold text-primary mb-1.5"
              >
                {t("signup.title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-sm sm:text-base text-gray-600"
              >
                {t("signup.subtitle")}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mb-5 sm:mb-6"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                {t("signup.iAm")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleSelect(role.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedRole === role.value
                          ? "border-primary bg-primary-light"
                          : "border-gray-200 hover:border-primary"
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 ${
                          selectedRole === role.value ? "text-primary" : "text-gray-400"
                        }`}
                      />
                      <div className={`font-semibold text-xs sm:text-sm ${selectedRole === role.value ? "text-primary" : "text-gray-700"}`}>
                        {role.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                        {role.description}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("signup.fullName")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("fullName")}
                    type="text"
                    disabled={isLoading}
                    className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={t("placeholder.fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="grid sm:grid-cols-2 gap-4 sm:gap-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("signup.email")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register("email")}
                      type="email"
                      disabled={isLoading}
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={t("placeholder.email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("signup.phone")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register("phoneNumber")}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9+]*"
                      disabled={isLoading}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9+]/g, '');
                      }}
                      className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={t("placeholder.phone")}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="grid sm:grid-cols-2 gap-4 sm:gap-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("signup.password")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={t("placeholder.password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("signup.confirmPassword")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isLoading}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        passwordsDontMatch
                          ? "border-red-300 focus:ring-red-500"
                          : passwordsMatch
                          ? "border-green-300 focus:ring-green-500"
                          : "border-gray-300 focus:ring-primary"
                      }`}
                      placeholder={t("placeholder.password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  {passwordsMatch && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {tc.passwordMatch}
                    </p>
                  )}
                  {passwordsDontMatch && (
                    <p className="text-sm text-red-600 mt-2">
                      {tc.passwordNoMatch}
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </motion.div>

              {password && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-xl p-3 sm:p-4"
                >
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    {tc.passwordRequirements}
                  </p>
                  <ul className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}></span>
                      {tc.requirement1}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></span>
                      {tc.requirement2}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></span>
                      {tc.requirement3}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></span>
                      {tc.requirement4}
                    </li>
                  </ul>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className="w-full py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === 'fr' ? 'Création en cours...' : 'Creating Account...'}
                    </>
                  ) : (
                    t("signup.button")
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="mt-5 text-center"
            >
              <p className="text-gray-600 text-sm sm:text-base">
                {t("signup.haveAccount")}{" "}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:text-primary-dark transition-colors duration-300"
                >
                  {t("signup.loginLink")}
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}