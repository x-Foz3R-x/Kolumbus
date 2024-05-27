import * as z from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export const signUpSchema = authSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
});

export const verifyEmailSchema = z.object({
  code: z.string().min(6, { message: "Verification code must be 6 characters long" }).max(6),
});

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
});

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userTypeSchema = z.object({
  value: z.number(),
  name: z.enum(["Explorer", "Navigator", "Captain"]),

  maxMemberships: z.number(),
  maxTripUpgrades: z.number(),

  // Allows uploading memories (photos) for events during a trip. Uploads permitted until the next day.
  memories: z.boolean(),
});

// To be defined
export enum UserFlags {
  STAFF = 1 << 0,
  PARTNER = 1 << 1,
}

export const publicMetadataSchema = z.object({
  type: z.number(),
  flags: z.number(),
});

export type UserTypeSchema = z.infer<typeof userTypeSchema>;
export type PublicMetadataSchema = z.infer<typeof publicMetadataSchema>;
