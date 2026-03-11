"use client";

import { motion } from "framer-motion";
import Link from "@/components/LocalizedLink";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Link
            href="/login"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Send Reset Link
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
