import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  phoneNumber: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: z.string(),
  role: z.enum(['renter', 'landlord'], {
    message: 'Role must be either renter or landlord',
  }),
  country: z.enum(['fr', 'in'], {
    message: 'Country must be either fr or in',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

// Admin login validation schema
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;