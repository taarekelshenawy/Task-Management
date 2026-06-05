
import SignUpIcon from "../assets/Icon.svg";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import {reset } from "../utils/validationSchema";
import { resetPassword } from "../Store/Auth/act/Resetpassword";
import { toast } from "react-toastify";


type Inputs = {
 password: string;
 confirmPassword:string
};

export default function Resetpassword() {
  const dispatch = useAppDispatch();
  const { loading} = useAppSelector((state) => state.Auth);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(reset),
  });



  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const {confirmPassword, ...payload } = data;
    const result= await dispatch(resetPassword(payload))
    if(resetPassword.fulfilled.match(result)){
        toast.success("Your password has been updated successfully.")
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
                {...register("password")}
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
                {...register("confirmPassword")}
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

          <ul className="space-y-2 bg-[#E8EDFF] p-4 rounded-xl text-[#434654]">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-green-500 flex items-center justify-center text-[8px] text-green-500">
                ✔
              </span>
              <span>8 - 64 characters</span>
            </li>

            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span>
              <span>Uppercase & Lowercase</span>
            </li>

            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span>
              <span>At least one digit</span>
            </li>
          </ul>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#003D9B] text-white p-3 rounded-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Update Password"}
          </button>
        </div>

        <Link
          to="/"
          className="text-center mt-6 text-[#003D9B] font-bold"
        >
          Back to log in
        </Link>

      </form>
    </div>
  );
}















