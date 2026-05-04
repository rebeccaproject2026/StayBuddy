"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Mail, Phone, Lock, Home, Users, Eye, EyeOff,
  CheckCircle, Loader2, Scale, Upload, FileText, ArrowLeft, ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import toast, { Toaster } from "react-hot-toast";

// ── Schemas ──────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please provide a valid phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
  role: z.enum(["renter", "landlord", "lawyer"]),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const lawyerStep2Schema = z.object({
  barCouncilNumber: z.string().min(1, "Bar council number is required").trim(),
  experienceYears: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ message: "Enter a valid number" }).min(0, "Cannot be negative")
  ),
  aadharNumber: z.string().min(12, "Aadhar must be 12 digits").max(12, "Aadhar must be 12 digits").regex(/^\d{12}$/, "Aadhar must be 12 digits"),
  barCouncilCertificate: z.string().min(1, "Bar council certificate is required"),
});

type Step1Data = z.infer<typeof step1Schema>;
type LawyerStep2Data = z.infer<typeof lawyerStep2Schema>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const params = useParams();
  const country = params.country as string;
  const { t, language } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<"renter" | "landlord" | "lawyer">("renter");
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Certificate upload
  const [certFileName, setCertFileName] = useState("");
  const [certBase64, setCertBase64] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: reg1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    setValue: setValue1,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { role: "renter" },
  });

  const {
    register: reg2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm<LawyerStep2Data>({
    resolver: zodResolver(lawyerStep2Schema) as any,
  });

  const handleRoleSelect = (role: "renter" | "landlord" | "lawyer") => {
    setSelectedRole(role);
    setValue1("role", role);
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setCertFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCertBase64(base64);
      setValue2("barCouncilCertificate", base64);
    };
    reader.readAsDataURL(file);
  };

  // Step 1 submit — for non-lawyers, go straight to API; for lawyers, go to step 2
  const onStep1Submit = async (data: Step1Data) => {
    if (data.role === "lawyer") {
      setStep1Data(data);
      setStep(2);
      return;
    }
    await submitSignup(data, null);
  };

  // Step 2 submit (lawyer only)
  const onStep2Submit = async (data: LawyerStep2Data) => {
    if (!step1Data) return;
    await submitSignup(step1Data, data);
  };

  const submitSignup = async (s1: Step1Data, s2: LawyerStep2Data | null) => {
    setIsLoading(true);
    try {
      const payload: Record<string, any> = {
        fullName: s1.fullName,
        email: s1.email,
        phoneNumber: s1.phoneNumber,
        password: s1.password,
        confirmPassword: s1.confirmPassword,
        role: s1.role,
        country: country === "fr" ? "fr" : "in",
      };
      if (s2) {
        payload.barCouncilNumber = s2.barCouncilNumber;
        payload.experienceYears = s2.experienceYears;
        payload.aadharNumber = s2.aadharNumber;
        payload.barCouncilCertificate = s2.barCouncilCertificate;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok) {
        if (result.pendingApproval) {
          router.push(
            `/${country}/verify-otp?email=${encodeURIComponent(s1.email)}&pendingApproval=true`
          );
        } else {
          router.push(`/${country}/verify-otp?email=${encodeURIComponent(s1.email)}`);
        }
      } else {
        if (result.details && Array.isArray(result.details)) {
          result.details.forEach((d: any) => toast.error(`${d.field}: ${d.message}`, { duration: 3000, position: "top-center" }));
        } else {
          toast.error(result.error || "Failed to create account", { duration: 3000, position: "top-center" });
        }
      }
    } catch {
      toast.error("Connection error. Please try again.", { duration: 3000, position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: "renter" as const, label: t("signup.tenant"), icon: Users, description: t("signup.tenantDesc") },
    { value: "landlord" as const, label: t("signup.owner"), icon: Home, description: t("signup.ownerDesc") },
    { value: "lawyer" as const, label: language === "fr" ? "Avocat" : "Lawyer", icon: Scale, description: language === "fr" ? "Conseiller juridique" : "Legal advisor" },
  ];

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  const pwLabels = {
    en: { req: "Password Requirements:", r1: "At least 8 characters", r2: "One uppercase letter", r3: "One lowercase letter", r4: "One number", match: "Passwords match", noMatch: "Passwords do not match" },
    fr: { req: "Exigences du mot de passe:", r1: "Au moins 8 caractères", r2: "Une lettre majuscule", r3: "Une lettre minuscule", r4: "Un chiffre", match: "Les mots de passe correspondent", noMatch: "Les mots de passe ne correspondent pas" },
  };
  const pw = pwLabels[language] ?? pwLabels.en;

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

            {/* Header */}
            <div className="text-center mb-5 sm:mb-7">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1.5">
                {t("signup.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">{t("signup.subtitle")}</p>
              {selectedRole === "lawyer" && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                        {s}
                      </div>
                      {s < 2 && <div className={`w-8 h-0.5 ${step > s ? "bg-primary" : "bg-gray-200"}`} />}
                    </div>
                  ))}
                  <span className="ml-2 text-xs text-gray-500">
                    {step === 1 ? "Basic Info" : "Professional Details"}
                  </span>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {/* ── STEP 1 ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  {/* Role selector */}
                  <div className="mb-5 sm:mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">{t("signup.iAm")}</label>
                    <div className="grid grid-cols-3 gap-3">
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
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${selectedRole === role.value ? "border-primary bg-primary-light" : "border-gray-200 hover:border-primary"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 ${selectedRole === role.value ? "text-primary" : "text-gray-400"}`} />
                            <div className={`font-semibold text-xs sm:text-sm ${selectedRole === role.value ? "text-primary" : "text-gray-700"}`}>{role.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">{role.description}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit1(onStep1Submit)} className="space-y-4 sm:space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("signup.fullName")} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input {...reg1("fullName")} type="text" disabled={isLoading} className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50" placeholder={t("placeholder.fullName")} />
                      </div>
                      {errors1.fullName && <p className="text-red-500 text-sm mt-1">{errors1.fullName.message}</p>}
                    </div>

                    {/* Email + Phone */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("signup.email")} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input {...reg1("email")} type="email" disabled={isLoading} className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50" placeholder={t("placeholder.email")} />
                        </div>
                        {errors1.email && <p className="text-red-500 text-sm mt-1">{errors1.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("signup.phone")} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input {...reg1("phoneNumber")} type="tel" inputMode="numeric" disabled={isLoading} onInput={(e) => { (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9+]/g, ""); }} className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50" placeholder={t("placeholder.phone")} />
                        </div>
                        {errors1.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors1.phoneNumber.message}</p>}
                      </div>
                    </div>

                    {/* Password + Confirm */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("signup.password")} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input {...reg1("password")} type={showPassword ? "text" : "password"} disabled={isLoading} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50" placeholder={t("placeholder.password")} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </button>
                        </div>
                        {errors1.password && <p className="text-red-500 text-sm mt-1">{errors1.password.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("signup.confirmPassword")} <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input {...reg1("confirmPassword")} type={showConfirmPassword ? "text" : "password"} disabled={isLoading} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none disabled:opacity-50 ${passwordsDontMatch ? "border-red-300 focus:ring-red-500" : passwordsMatch ? "border-green-300 focus:ring-green-500" : "border-gray-300 focus:ring-primary"}`} placeholder={t("placeholder.password")} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </button>
                        </div>
                        {passwordsMatch && <p className="text-sm text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" />{pw.match}</p>}
                        {passwordsDontMatch && <p className="text-sm text-red-600 mt-2">{pw.noMatch}</p>}
                        {errors1.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors1.confirmPassword.message}</p>}
                      </div>
                    </div>

                    {/* Password strength */}
                    {password && (
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">{pw.req}</p>
                        <ul className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                          {[
                            [password.length >= 8, pw.r1],
                            [/[A-Z]/.test(password), pw.r2],
                            [/[a-z]/.test(password), pw.r3],
                            [/[0-9]/.test(password), pw.r4],
                          ].map(([ok, label], i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-gray-300"}`} />
                              {label as string}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 sm:py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" />{language === "fr" ? "Création en cours..." : "Creating Account..."}</>
                      ) : selectedRole === "lawyer" ? (
                        <><ArrowRight className="w-5 h-5" />{language === "fr" ? "Suivant" : "Next: Professional Details"}</>
                      ) : (
                        t("signup.button")
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── STEP 2 (Lawyer only) ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="mb-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                    <Scale className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">Professional Verification Required</p>
                      <p className="text-xs text-yellow-700 mt-0.5">Your account will be reviewed by an admin before you can log in. All fields are required.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit2(onStep2Submit as any)} className="space-y-4 sm:space-y-5">
                    {/* Bar Council Number + Experience */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bar Council Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input {...reg2("barCouncilNumber")} type="text" disabled={isLoading} className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50" placeholder="e.g. BCI/123/2020" />
                        </div>
                        {errors2.barCouncilNumber && <p className="text-red-500 text-sm mt-1">{errors2.barCouncilNumber.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) <span className="text-red-500">*</span></label>
                        <input {...reg2("experienceYears")} type="number" min={0} disabled={isLoading} className="w-full px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50" placeholder="e.g. 5" />
                        {errors2.experienceYears && <p className="text-red-500 text-sm mt-1">{errors2.experienceYears.message}</p>}
                      </div>
                    </div>

                    {/* Aadhar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number <span className="text-red-500">*</span></label>
                      <input
                        {...reg2("aadharNumber")}
                        type="text"
                        inputMode="numeric"
                        maxLength={12}
                        disabled={isLoading}
                        onInput={(e) => { (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, ""); }}
                        className="w-full px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50"
                        placeholder="12-digit Aadhar number"
                      />
                      {errors2.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors2.aadharNumber.message}</p>}
                    </div>

                    {/* Bar Council Certificate Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bar Council Certificate <span className="text-red-500">*</span></label>
                      <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleCertUpload} />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className={`w-full py-3 px-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-colors text-sm ${certBase64 ? "border-green-400 bg-green-50 text-green-700" : "border-gray-300 hover:border-primary text-gray-500 hover:text-primary"} disabled:opacity-50`}
                      >
                        {certBase64 ? (
                          <><FileText className="w-5 h-5" /><span className="truncate max-w-xs">{certFileName}</span><CheckCircle className="w-4 h-4 flex-shrink-0" /></>
                        ) : (
                          <><Upload className="w-5 h-5" /><span>Upload certificate (image or PDF, max 5MB)</span></>
                        )}
                      </button>
                      {errors2.barCouncilCertificate && <p className="text-red-500 text-sm mt-1">{errors2.barCouncilCertificate.message}</p>}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-primary-dark transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {isLoading ? (
                          <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
                        ) : (
                          <><Scale className="w-5 h-5" />Submit for Review</>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login link */}
            <div className="mt-5 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                {t("signup.haveAccount")}{" "}
                <Link href="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors duration-300">
                  {t("signup.loginLink")}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
