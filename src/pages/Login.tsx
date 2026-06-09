import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { LoginSchema } from '../utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Componenets/Header/Header';
import { loginFunction } from '../services/authService';
import { useState } from 'react';

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [rememberMe,setRememberMe]=useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const payload = {rememberMe,...data}
    try {
      setLoading(true);
      await loginFunction(payload);

      toast.success('Login success');
      setLoading(false);
      navigate('/project/add');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';

      toast.error(message);
    }
  };

  return (
    <div className=" min-h-screen pb-14">
      <Header />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-form flex flex-col max-w-141.75 mx-auto p-12 bg-white mt-2"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-slate-md font-medium">
            Join the editorial approach to task management.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-md font-bold">Email</label>

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

          {/* PASSWORD */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-slate-md font-bold">Password</label>

            <input
              {...register('password')}
              type="password"
              className="bg-surface-high  w-full h-10 rounded px-3"
              placeholder="enter password"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" onChange={()=>setRememberMe(true)} />
              <label
                htmlFor="remember"
                className="text-secondary font-semibold"
              >
                Remember me
              </label>
            </div>

            <Link to="/forgot-password" className="text-primary font-semibold">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="cursor-pointer bg-primary text-white p-3 rounded-sm font-semibold"
          >
            {loading ? '...loading' : 'Log in'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <Link
            to="/sign-up"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
