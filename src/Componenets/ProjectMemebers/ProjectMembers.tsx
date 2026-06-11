import arrowIcon from '../../assets/arrowIcon.png';
import inviteIcon from '../../assets/InviteIcon.png';
import { useEffect, useState } from 'react';
import { getProjectMembers } from '../../services/projectService';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function ProjectMembers() {
    const [members,setMemebers]=useState([{metadata:{name:''},email:'',role:''}])
    const {projectId}=useParams()
    if(!projectId){
        throw new Error('there no project Id')
    }
     console.log(members)
   
     useEffect(() => {
     const fetchProjectMembers =async()=>{
        try{
            const response = await getProjectMembers({projectId});
            const data = await response.json();
            setMemebers(data)

        }catch(error){
            if(error instanceof Error){
   toast.error(error.message)
            }
         

        }

     }
     fetchProjectMembers()
     }, [projectId]
    );
       const name = members[0]?.metadata.name ?? '';

  const userName = name
    ? `${name.split(' ')[0]?.slice(0, 1)?.toUpperCase() ?? ''}
     ${name.split(' ')[1]?.slice(0, 1)?.toUpperCase() ?? ''}`
    : '';
  return (
    <div className='w-full p-7'>
{/* 
         <div className="flex flex-col w-full">
        {loading ? (
          <div className="p-4">...loading </div>
        ) : (
          <div className="flex justify-end p-3 ">
            <div className="flex items-center gap-2 ">
              <div>
                <h2 className="font-bold">{user?.user_metadata.name}</h2>
                <p className="font-bold text-[#003D9B]">
                  {user?.user_metadata.department}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0052CC] flex justify-center items-center text-white">
                <p>{user ? userName : ''}</p>
              </div>
            </div>
          </div>
        )}
        </div> */}

          <header className="flex items-center gap-2 max-sm:hidden">
        <p className="font-bold text-secondary">PROJECTS</p>
        <img src={arrowIcon} className="w-2" />
        <p className="font-bold text-primary">Members</p>
      </header>

      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <h1 className="text-4xl font-semibold text-slate-dark">
      Project Members
        </h1>

        <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
          <img src={inviteIcon} />
          <span className="font-bold">Invite Member</span>
        </button>
      </section>

 
      <table className=" mt-16 w-full max-w-197.25 bg-slate-lighter/30 border rounded-lg overflow-hidden mx-auto">
  
  {/* header */}
  <thead className="text-left">
    <tr>
      <th className="p-4 text-sm font-semibold text-gray-600">
        MEMBER
      </th>
      <th className="p-4 text-sm font-semibold text-gray-600">
        ROLE
      </th>
      <th className="p-4 text-sm font-semibold text-gray-600">
        ACTIONS
      </th>
    </tr>
  </thead>

  {/* body */}
  <tbody className='bg-white '>
    <tr className=" hover:bg-gray-50 transition">

      {/* MEMBER */}
      <td className="p-4">
        <div className="flex items-center gap-3">

          {/* avatar */}
          <div className="w-12 h-12 rounded-xl bg-[#0052CC] flex items-center justify-center text-white font-bold">
            {members ? userName : ""}
          </div>

          {/* info */}
          <div className="flex flex-col">
            <h2 className="font-semibold text-gray-900">
              {userName}
            </h2>
            <p className="text-sm text-gray-500">
              {members[0].email}
            </p>

          
          </div>

        </div>
      </td>

      {/* ROLE column (لو عايز تفصله بدل ما يكون تحت الاسم) */}
    <td className="p-4 align-middle">
  <span className="bg-primary w-17 h-5 p-1 rounded-2xl px-7 text-white">
    {members[0]?.role}
  </span>
</td>

      {/* ACTIONS */}
      <td className="p-4 align-middle">
        <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200">
          Remove
        </button>
      </td>

    </tr>
  </tbody>

</table>
     
    </div>
  )
}
  