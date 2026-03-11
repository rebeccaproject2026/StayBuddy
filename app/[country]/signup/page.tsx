"use client";

import { useState } from "react";
import Link from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Lock, Home, Users, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  role: z.enum(["tenant", "owner"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<"tenant" | "owner">("tenant");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t, language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "tenant",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("Form submitted:", data);
  };

  const handleRoleSelect = (role: "tenant" | "owner") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const roles = [
    {
      value: "tenant" as const,
      label: t("signup.tenant"),
      icon: Users,
      description: t("signup.tenantDesc"),
    },
    {
      value: "owner" as const,
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
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop')` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-3xl font-bold text-primary mb-2"
            >
              {t("signup.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-gray-600"
            >
              {t("signup.subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mb-6"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedRole === role.value
                        ? "border-primary bg-primary-light"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        selectedRole === role.value
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    />
                    <div
                      className={`font-semibold text-sm ${
                        selectedRole === role.value
                          ? "text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      {role.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {role.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("signup.fullName")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("fullName")}
                  type="text"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none"
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
              className="grid md:grid-cols-2 gap-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("signup.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none"
                    placeholder={t("placeholder.email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("signup.phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("phone")}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none"
                    placeholder={t("placeholder.phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="grid md:grid-cols-2 gap-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("signup.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none"
                    placeholder={t("placeholder.password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("signup.confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 outline-none ${
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                className="bg-gray-50 rounded-xl p-4"
              >
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {tc.passwordRequirements}
                </p>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300"
              >
                {t("signup.button")}
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
  );
}
