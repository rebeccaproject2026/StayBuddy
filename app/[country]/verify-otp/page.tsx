"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import toast, { Toaster } from "react-hot-toast";

function VerifyOTPContent() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpRef = useRef<string[]>(["", "", "", "", "", ""]);
  const isSubmitting = useRef(false); // prevent double submit

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const country = params.country as string;
  const email = searchParams.get("email") || "";
  const { language } = useLanguage();

  const t = {
    title: language === "fr" ? "Vérifiez votre email" : "Verify your email",
    subtitle:
      language === "fr"
        ? "Nous avons envoyé un code à 6 chiffres à"
        : "We sent a 6-digit code to",
    verify: language === "fr" ? "Vérifier" : "Verify",
    verifying: language === "fr" ? "Vérification..." : "Verifying...",
    resend: language === "fr" ? "Renvoyer le code" : "Resend code",
    resending: language === "fr" ? "Envoi..." : "Sending...",
    resendIn: language === "fr" ? "Renvoyer dans" : "Resend in",
    backToSignup: language === "fr" ? "Retour à l'inscription" : "Back to signup",
    enterCode: language === "fr" ? "Entrez le code OTP" : "Enter OTP code",
  };

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const submitOTP = async (otpString: string) => {
    if (otpString.length !== 6) return;
    if (isSubmitting.current) return; // guard against double calls
    isSubmitting.current = true;
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString, country }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          language === "fr"
            ? "Email vérifié avec succès!"
            : "Email verified successfully!",
          {
            duration: 3000,
            position: "top-center",
            style: { background: "#10B981", color: "white", fontWeight: "500" },
          }
        );
        setTimeout(() => router.push(`/login`), 2000);
      } else {
        toast.error(data.error || "Verification failed", { position: "top-center" });
        const cleared = ["", "", "", "", "", ""];
        setOtp(cleared);
        otpRef.current = cleared;
        isSubmitting.current = false;
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch {
      toast.error(
        language === "fr" ? "Erreur de connexion" : "Connection error",
        { position: "top-center" }
      );
      isSubmitting.current = false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);
    const newOtp = [...otpRef.current];
    newOtp[index] = digit;
    otpRef.current = newOtp;
    setOtp([...newOtp]);

    // Move focus forward
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    if (newOtp.every((d) => d !== "")) {
      submitOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current
        const newOtp = [...otpRef.current];
        newOtp[index] = "";
        otpRef.current = newOtp;
        setOtp([...newOtp]);
      } else if (index > 0) {
        // Move back
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    otpRef.current = newOtp;
    setOtp([...newOtp]);

    const nextEmpty = newOtp.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

    if (newOtp.every((d) => d !== "")) {
      submitOTP(newOtp.join(""));
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, country }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          language === "fr" ? "Nouveau code envoyé!" : "New code sent!",
          {
            position: "top-center",
            style: { background: "#10B981", color: "white", fontWeight: "500" },
          }
        );
        setCountdown(60);
        setCanResend(false);
        isSubmitting.current = false;
        const cleared = ["", "", "", "", "", ""];
        setOtp(cleared);
        otpRef.current = cleared;
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      } else {
        toast.error(data.error || "Failed to resend", { position: "top-center" });
      }
    } catch {
      toast.error(
        language === "fr" ? "Erreur de connexion" : "Connection error",
        { position: "top-center" }
      );
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "";

  const filledCount = otp.filter((d) => d !== "").length;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/homebg.png')`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 md:p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-500 text-sm">
              {t.subtitle}{" "}
              <span className="font-semibold text-gray-700">{maskedEmail}</span>
            </p>
          </motion.div>

          {/* OTP Inputs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
              {t.enterCode}
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isVerifying}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200 disabled:opacity-50
                    ${digit ? "border-primary bg-primary/5 text-primary" : "border-gray-300 text-gray-900"}
                    focus:border-primary focus:ring-2 focus:ring-primary/20`}
                />
              ))}
            </div>
          </motion.div>

          {/* Verify Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => submitOTP(otpRef.current.join(""))}
              disabled={isVerifying || filledCount !== 6}
              whileHover={!isVerifying ? { scale: 1.02 } : {}}
              whileTap={!isVerifying ? { scale: 0.98 } : {}}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.verifying}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t.verify}
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Resend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center justify-center gap-2 mx-auto text-primary font-semibold hover:text-primary-dark transition-colors disabled:opacity-50"
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isResending ? t.resending : t.resend}
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                {t.resendIn}{" "}
                <span className="font-semibold text-gray-700">{countdown}s</span>
              </p>
            )}
          </motion.div>

          {/* Back link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push(`/${country}/signup`)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← {t.backToSignup}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <>
      <Toaster />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <VerifyOTPContent />
      </Suspense>
    </>
  );
}
