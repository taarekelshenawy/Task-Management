import { useEffect, useState } from 'react';
import SignUpIcon from '../assets/Icon.svg';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Store/hooks';
import { forgotPassword } from '../Store/Auth/act/Forgotpassword';
import { EmailSchema } from '../utils/validationSchema';
import { toast } from 'react-toastify';

type Inputs = {
  email: string;
};

export default function Forgetpassword() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.Auth);
  const [showMessage, setShowMessage] = useState(false);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCount, setResendCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(EmailSchema),
  });

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setEmail(data.email);

    const result = await dispatch(forgotPassword(data));

    if (forgotPassword.fulfilled.match(result)) {
      setShowMessage(true);
      setTimeLeft(300);
      setIsTimerRunning(true);
      toast.success('success');
    }
    if (forgotPassword.rejected.match(result)) {
      toast.error(result.payload as string);
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) return;

    const result = await dispatch(
      forgotPassword({
        email,
      }),
    );

    if (forgotPassword.fulfilled.match(result)) {
      setResendCount((prev) => prev + 1);
      setTimeLeft(300);
      setIsTimerRunning(true);
    }
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

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
          <h2 className="text-3xl font-bold">Forgot password?</h2>

          <p className="text-[#4F5F7B] font-medium mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[#4F5F7B] font-bold">Email address</label>

            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="bg-[#D7E2FF] h-10 rounded px-3 outline-none"
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#003D9B] text-white p-3 rounded-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <Link to="/" className="text-center mt-6 text-[#003D9B] font-bold">
          Back to log in
        </Link>

        {showMessage && (
          <div className="bg-[#82F9BE33] p-4 rounded-lg mt-5 text-green-700">
            If an account exists with this email, we’ve sent a password reset
            link.
          </div>
        )}

        {showMessage && (
          <div className="mt-6">
            <p className="mb-2 text-[#4F5F7B]">Didn't receive the email?</p>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading || isTimerRunning || resendCount >= 3}
              className={`w-full h-10 rounded font-medium transition ${
                loading || isTimerRunning || resendCount >= 3
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#F1F3FF] text-[#003D9B]'
              }`}
            >
              {resendCount >= 3
                ? 'No more attempts available'
                : isTimerRunning
                  ? `Resend in ${minutes}:${seconds}`
                  : 'Resend Email'}
            </button>

            <p className="text-sm text-gray-500 mt-2">
              Attempts: {resendCount}/3
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
