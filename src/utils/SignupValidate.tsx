import { z } from "zod";

const signUpSchema = z
  .object({
     email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/^\S+$/, "Password must not contain spaces")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*]/, "Must contain at least one special character"),
 confirmPassword: z.string().min(1, "Confirm password is required"),
  data: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\u0600-\u06FF ]+$/,
        "Invalid characters in name"
      )
      .refine((val) => !/\s{2,}/.test(val), {
        message: "No multiple consecutive spaces allowed",
      })
      .refine((val) => !/^\s|\s$/.test(val), {
        message: "No leading or trailing spaces",
      }),

department: z.string().default("")
   
  })

  }).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

  export default signUpSchema
  