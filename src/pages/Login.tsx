import SignUpIcon from "../assets/Icon.svg";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { LoginSchema } from "../utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "../Store/AuthSlice";
import { useAppDispatch } from "../Store/hooks";
import { useAppSelector } from "../Store/hooks";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";


type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
    const dispatch=useAppDispatch();
    const navigate =useNavigate()
    const {loading}=useAppSelector((state)=>state.Auth);
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async(data) =>{
   const result= await dispatch(signIn(data));
   if(signIn.fulfilled.match(result)){
    navigate("/")
       toast.success("Login successful 🎉");
   }
   if (signIn.rejected.match(result)) {
  toast.error(result.payload as string);
}

  };

  return (
    <div className="bg-[#F9F9FF] pb-14">
      <div className="flex items-center bg-[#F9F9FF] gap-2 font-bold px-10 py-8 fixed top-0 left-0 right-0">
        <img src={SignUpIcon} />
        <h1 className="text-[#041B3C] text-xl">TASKLY</h1>
      </div>

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

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="text-[#4F5F7B] font-bold">Email</label>

            <input
              {...register("email")}
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

        {/* PASSWORD */}
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

          {/* SUBMIT */}
          <button
            type="submit"
            className="cursor-pointer bg-[#003D9B] text-white p-3 rounded-sm font-semibold"
          >
            {loading ? '...loading' : 'Log in'}
           
          </button>
        </div>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-600 mt-8">
         Don't have an account?{" "}
          <Link to="/signUP" className="text-blue-600 font-medium hover:underline">
          Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}





















