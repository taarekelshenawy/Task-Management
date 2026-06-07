
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import signUpSchema from '../utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Signup } from '../Store/Auth/act/Signup';
import { useAppDispatch } from '../Store/hooks';
import { useAppSelector } from '../Store/hooks';
import { toast } from 'react-toastify';
import Header from '../Componenets/Header/Header';

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
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.Auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const result = dispatch(Signup(data));
    if (Signup.fulfilled.match(result)) {
      toast.success('Account created successfully ');
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="bg-[#F9F9FF] pb-14">
    <Header/>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-141.75 mx-auto p-12 bg-[#FFFFFF] mt-20"
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
              className="bg-[#D7E2FF] h-10 rounded px-3"
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
              className="bg-[#D7E2FF] h-10 rounded px-3"
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
              className="bg-[#D7E2FF] h-10 rounded px-3"
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

            {/* CONFIRM PASSWORD */}
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
          </div>

          {/* PASSWORD RULES UI */}
          <ul className="space-y-2 bg-[#E8EDFF] p-4 rounded-xl text-[#434654]">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-green-500 flex items-center justify-center text-[8px] text-green-500">
                ✔
              </span>
              <span>At least 8 characters</span>
            </li>

            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span>
              <span>One uppercase, lowercase, and digit</span>
            </li>

            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span>
              <span>One special character</span>
            </li>
          </ul>

          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-[#003D9B] text-white p-3 rounded-sm font-semibold"
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
    </div>
  );
}
