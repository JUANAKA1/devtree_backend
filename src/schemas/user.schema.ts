import { z } from "zod";

export const userRegisterSchema = z.object({
  handle: z
    .string()
    .trim()
    .min(3, "El handle debe tener al menos 3 caracteres"),
  name: z
    .string()
    .trim()
    .min(2, "El nombre es requerido y debe tener al menos 2 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Debe ser un correo válido")
    .min(5, "El correo es requerido y debe tener al menos 5 caracteres"),
  password: z
    .string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const userLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Debe ser un correo válido")
    .min(5, "El correo es requerido"),
  password: z.string().trim().min(6, "La contraseña es requerida"),
});
export const userProfileSchema = z.object({
  handle: z
    .string()
    .trim()
    .min(3, "El handle debe tener al menos 3 caracteres"),
  description: z
    .string()
    .trim()
    .min(3, "La descripción debe tener al menos 2 caracteres"),
});
