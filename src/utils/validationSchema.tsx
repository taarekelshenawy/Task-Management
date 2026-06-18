import { z } from 'zod';

const signUpSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be at most 64 characters')
      .regex(/^\S+$/, 'Password must not contain spaces')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[!@#$%^&*]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    data: z.object({
      name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters')
        .regex(
          /^[A-Za-zÀ-ÖØ-öø-ÿ\u0600-\u06FF ]+$/,
          'Invalid characters in name',
        )
        .refine((val) => !/\s{2,}/.test(val), {
          message: 'No multiple consecutive spaces allowed',
        })
        .refine((val) => !/^\s|\s$/.test(val), {
          message: 'No leading or trailing spaces',
        }),

      department: z.string(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const EmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .regex(/^\S+$/, 'Password must not contain spaces')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Must contain at least one special character'),
});

export const reset = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be at most 64 characters')
      .regex(/^\S+$/, 'Password must not contain spaces')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[!@#$%^&*]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const AddProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project title must be at least 3 characters')
    .max(100, 'Project title must not exceed 100 characters'),

  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters'),
});

export const AddProjectEpicsSchema = z.object({
  title: z
    .string()
    .min(3, 'Project title must be at least 3 characters')
    .max(100, 'Project title must not exceed 100 characters'),

  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters'),

  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Deadline must be in the future',
  }),
});

export const createTaskSchema = z.object({
  epic_id: z.string(),
  title: z.string().min(3),
  description: z.string().min(5),

  assignee_id: z.string().optional().or(z.literal('')),

  due_date: z.string().min(1),

  status: z.enum(['TO_DO', 'IN_PROGRESS', 'DONE']),
});

export default signUpSchema;
