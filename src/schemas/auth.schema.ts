import { z } from "zod";

const phoneSchema = z
  .string()
  .min(10, "Enter a valid phone number")
  .max(15, "Enter a valid phone number")
  .regex(/^[+\d][\d\s-]*$/, "Enter a valid phone number");

export const loginSchema = z.object({
  phone: phoneSchema,
});

/** Dev convenience: email + password still supported by API */
export const loginPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: phoneSchema,
});

export const otpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export const selectRoleSchema = z.object({
  role: z.enum(["USER", "DRIVER"]),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: phoneSchema,
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginPasswordInput = z.infer<typeof loginPasswordSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type SelectRoleInput = z.infer<typeof selectRoleSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
