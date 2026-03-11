"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "@/components/LocalizedLink";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResetPasswordPage() {
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const content = {
    en: {
      title: "Reset Password",
      subtitle: "Enter your new password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      passwordPlaceholder: "Enter new password",
      confirmPlaceholder: "Confirm new password",
      resetButton: "Reset Password",
      backToLogin: "Back to Login",
      successTitle: "Password Reset Successful!",
      successMessage: "Your password has been reset successfully. You can now login with your new password.",
      goToLogin: "Go to Login",
      passwordRequirements: "Password Requirements:",
      requirement1: "At least 8 characters",
      requirement2: "One uppercase letter",
      requirement3: "One lowercase letter",
      requirement4: "One number",
      passwordMatch: "Passwords match",
      passwordNoMatch: "Passwords do not match",
    },
    fr: {
      title: "Réinitialiser le mot de passe",
      subtitle: "Entrez votre nouveau mot de passe",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      passwordPlaceholder: "Entrez le nouveau mot de passe",
      confirmPlaceholder: "Confirmez le nouveau mot de passe",
      resetButton: "Réinitialiser le mot de passe",
      backToLogin: "Retour à la connexion",
      successTitle: "Réinitialisation réussie!",
      successMessage: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
      goToLogin: "Aller à la connexion",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword && password.length >= 8) {
      setIsSuccess(true);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {tc.successTitle}
            </h1>
            <p className="text-gray-600 mb-8">
              {tc.successMessage}
            </p>

            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {tc.goToLogin}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2">
              {tc.title}
            </h1>
            <p className="text-gray-600">
              {tc.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tc.newPassword}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                  placeholder={tc.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tc.confirmPassword}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 outline-none ${
                    passwordsDontMatch
                      ? "border-red-300 focus:ring-red-500"
                      : passwordsMatch
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                  placeholder={tc.confirmPlaceholder}
                  required
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
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {tc.passwordRequirements}
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
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
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!passwordsMatch || password.length < 8}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tc.resetButton}
            </motion.button>

            <Link
              href="/login"
              className="block text-center text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
            >
              {tc.backToLogin}
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
