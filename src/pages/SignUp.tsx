import SignUpIcon from '../assets/Icon.svg'

export default function SignUp() {
  return (
    <div className='bg-[#F9F9FF] pb-14'>
        <div className='flex items-center bg-[#F9F9FF] gap-2 font-bold px-10 py-8 fixed top-0 left-0 right-0'>
            <img src={SignUpIcon}></img>
            <h1 className='text-[#041B3C] text-xl'>TASKLY</h1>
        </div>
        <form className='flex flex-col max-w-141.75 mx-auto p-12 bg-[#FFFFFF]  mt-20'>
            <div className='text-center mb-6'>
                <h2 className='text-3xl font-bold'>Create your workspace</h2>
                <p className='text-[#4F5F7B] font-medium'>Join the editorial approach to task management.</p>
            </div>
            {/*  form input */}
            <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='name' className='text-[#4F5F7B] font-bold'>Name</label>
                    <input id='name' type='text' className='bg-[#D7E2FF] h-10 rounded px-3' placeholder='Enter full Name'></input>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email' className='text-[#4F5F7B] font-bold'>Email</label>
                    <input id='email' type='email' className='bg-[#D7E2FF] h-10 rounded px-3' placeholder='yourname@company.com'></input>
                </div>
                <div  className='flex flex-col gap-2' >
                    <label htmlFor='title' className='text-[#4F5F7B] font-bold'>Job Title (Optional)</label>
                    <input id='title' type='text' className='bg-[#D7E2FF] h-10 rounded px-3' placeholder='e.g. Project Manager'></input>
                </div>
                <div className='flex gap-5 items-center max-sm:flex-col max-sm:items-start'>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor='password' className='text-[#4F5F7B] font-bold'>Password</label>
                        <input id='password' type='password'  className='bg-[#D7E2FF] w-full h-10 rounded px-3' placeholder='enter password'></input>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor='confirmpassword' className='text-[#4F5F7B] font-bold'>Confirm Password</label>
                        <input id='confirmpassword' type='password' className='bg-[#D7E2FF] h-10 rounded px-3' placeholder='confirm password'></input>
                    </div>
                </div>
              <ul className="space-y-2 bg-[#E8EDFF] p-4 rounded-xl text-[#434654]">
                <li className="flex items-center gap-2">
                   <span className="w-2 h-2 p-1 rounded-full border-2 border-green-500 flex items-center justify-center text-[8px] font-bold text-green-500">
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
                <button type='submit' className='bg-[#003D9B] text-white p-3 rounded-sm font-semibold'>Create Account</button>
              
            </div>
            {/*  */}
              <p className="text-center text-sm text-gray-600 mt-8">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 font-medium hover:underline">
                        Log in
                    </a>
             </p>
 
        </form>
   
        

    </div>
  )
}
