import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import signUpSchema from '../../utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { registerFunction } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
  data: {
    name: string;
    department: string;
  };
};

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch('password') || '';

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      await registerFunction(data);
      toast('Account created successfully ');
      setLoading(false);
      navigate('/project');
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
    }
    // const result = dispatch(Signup(data));
    // if (Signup.fulfilled.match(result)) {
    //   toast.success('Account created successfully ');
    // } else {
    //   toast.error(error);
    // }
  };

  return (
    <>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" shadow-form flex flex-col max-w-141.75 mx-auto p-12 bg-white mt-4"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Create your workspace</h2>
          <p className="text-[#4F5F7B] font-medium">
            Join the editorial approach to task management.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* NAME */}
          <div className="flex flex-col gap-2">
            <label className="text-[#4F5F7B] font-bold">Name</label>

            <input
              {...register('data.name')}
              type="text"
              className="bg-surface-high h-10 rounded px-3"
              placeholder="Enter full Name"
            />

            {errors.data?.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.data.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="text-[#4F5F7B] font-bold">Email</label>

            <input
              {...register('email')}
              type="email"
              className="bg-surface-high h-10 rounded px-3"
              placeholder="yourname@company.com"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* JOB TITLE */}
          <div className="flex flex-col gap-2">
            <label className="text-[#4F5F7B] font-bold">
              Job Title (Optional)
            </label>

            <input
              {...register('data.department')}
              type="text"
              className="bg-surface-high h-10 rounded px-3"
              placeholder="e.g. Project Manager"
            />

            {errors.data?.department && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.data.department.message}
              </p>
            )}
          </div>

          {/* PASSWORD + CONFIRM */}
          <div className="flex gap-5 items-center max-sm:flex-col max-sm:items-start">
            {/* PASSWORD */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#4F5F7B] font-bold">Password</label>

              <input
                {...register('password')}
                type="password"
                className="bg-surface-high w-full h-10 rounded px-3"
                placeholder="enter password"
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#4F5F7B] font-bold">
                Confirm Password
              </label>

              <input
                {...register('confirmPassword')}
                type="password"
                className="bg-surface-high h-10 rounded px-3"
                placeholder="confirm password"
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* PASSWORD RULES UI */}
          <ul className="space-y-3 bg-slate-lighter p-5 rounded-xl text-[#434654]">
            {/* LENGTH */}
            <li className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs
                ${password.length >= 8 ? 'border-green-500 text-green-500 bg-green-50' : 'border-gray-400'}`}
              >
                {password.length >= 8 && '✓'}
              </span>
              <span className="text-sm">At least 8 characters</span>
            </li>

            {/* MIXED CASE + NUMBER */}
            <li className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs
                ${
                  /[A-Z]/.test(password) &&
                  /[a-z]/.test(password) &&
                  /[0-9]/.test(password)
                    ? 'border-green-500 text-green-500 bg-green-50'
                    : 'border-gray-400'
                }`}
              >
                {/[A-Z]/.test(password) &&
                  /[a-z]/.test(password) &&
                  /[0-9]/.test(password) &&
                  '✓'}
              </span>

              <span className="text-sm">
                One uppercase, lowercase, and digit
              </span>
            </li>

            {/* SPECIAL CHARACTER */}
            <li className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs
                ${/[!@#$%^&*]/.test(password) ? 'border-green-500 text-green-500 bg-green-50' : 'border-gray-400'}`}
              >
                {/[!@#$%^&*]/.test(password) && '✓'}
              </span>

              <span className="text-sm">One special character</span>
            </li>
          </ul>

          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-sm font-semibold"
          >
            {loading ? '...loading' : 'Create Account'}
          </button>
        </div>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </>
  );
}
