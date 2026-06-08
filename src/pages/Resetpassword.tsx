import SignUpIcon from '../assets/Icon.svg';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { reset } from '../utils/validationSchema';
import { resetPassword } from '../services/authService';
import { toast } from 'react-toastify';
import { useState } from 'react';

type Inputs = {
  password: string;
  confirmPassword: string;
};

export default function Resetpassword() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(reset),
  });
  const password = watch('password') || '';

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { confirmPassword, ...payload } = data;
    try {
      setLoading(true);
      await resetPassword(payload);

      toast.success('Password updated successfully');
      setLoading(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="bg-[#F9F9FF] pb-14 min-h-screen">
      <div className="flex items-center bg-[#F9F9FF] gap-2 font-bold px-10 py-8 fixed top-0 left-0 right-0">
        <img src={SignUpIcon} alt="logo" />
        <h1 className="text-[#041B3C] text-xl">TASKLY</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-141.75 mx-auto p-12 bg-white mt-20 rounded-lg"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Create a New Password</h2>
          <p className="text-[#4F5F7B] font-medium mt-2">
            Create a new, strong password to secure your workstation access.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#4F5F7B] font-bold">Password</label>

              <input
                {...register('password')}
                type="password"
                className="bg-[#D7E2FF] w-full h-10 rounded px-3"
                placeholder="enter password"
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[#4F5F7B] font-bold">
                Confirm Password
              </label>

              <input
                {...register('confirmPassword')}
                type="password"
                className="bg-[#D7E2FF] h-10 rounded px-3"
                placeholder="confirm password"
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
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
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#003D9B] text-white p-3 rounded-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Update Password'}
          </button>
        </div>

        <Link to="/" className="text-center mt-6 text-[#003D9B] font-bold">
          Back to log in
        </Link>
      </form>
    </div>
  );
}
