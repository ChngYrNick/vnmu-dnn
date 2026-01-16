import { z } from 'zod';

const changeLanguageSchema = z.object({
  language: z.enum(['en', 'uk']),
});

const signInSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(255),
});

const signUpSchema = z.object({
  email: z.string().email().max(255),
  fullName: z.string().min(1).max(255),
  password: z.string().min(6).max(255),
});

const updateProfileSchema = z.object({
  fullName: z.string().max(255).optional(),
  password: z.string().min(6).max(255).optional(),
});

const logoutQuerySchema = z.object({
  redirect: z.string().max(2048).optional(),
});

export {
  changeLanguageSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  logoutQuerySchema,
};
