import SignUpIcon from '../../assets/Icon.svg';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export default function InvitePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div >
        <div className="flex items-center justify-center  gap-2 font-bold px-10 py-8  ">
          <img src={SignUpIcon} />
          <h1 className="text-slate-dark text-xl">
            <Link to="/"> TASKLY</Link>
          </h1>
        </div>
        <div className='bg-white relative shadow-[0px_24px_48px_-12px_#041B3C0F]  flex flex-col gap-4 max-w-141.75 p-12  '>
              <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r  from-primary-container to-primary rounded-t-xl" />
            <div className='flex justify-center  '>
                  <p className='text-center font-bold p-1 bg-[#E0E8FF] w-52 rounded-2xl'>New Project Invitation</p>
            </div>
          
          <h1 className='text-3xl font-semibold text-slate-dark'>You've been invited to join new project</h1>
          <button className='cursor-pointer w-full h-10 bg-linear-to-r from-primary-container to-primary text-white'>Accept Invitation</button>
        </div>
      </div>
    </div>
  );
}
