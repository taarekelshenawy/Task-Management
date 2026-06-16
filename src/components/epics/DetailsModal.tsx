

import { useParams } from 'react-router-dom';
import EpicsIcon from '../../assets/EpicsModal.png';
import dateIcon from '../../assets/dateIcon.png';
import UserInfo from './UserInfo';
import { getEpicDetails } from '../../services/epicsService';
import { useEffect, useState } from 'react';
import Helper from '../../utils/helper';


 type User = {
  sub: string;
  name: string;
  email: string;
  department: string;
};
 type EpicDetails = {
  id: string;
  epic_id: string;
  title: string;
  description: string;
  deadline: string;
  project_id: string;
  created_at: string;
  created_by: User;
  assignee: User;
};

export default function DetailsModal({epicId,modalStatus}:{epicId:string}) {
  const [epicDetails,setEpicDetails]=useState<EpicDetails[]>([]);
  const {projectId}=useParams();
  if(!projectId){
 throw new Error('there is no id')
  }

  useEffect(()=>{
    const getEpic =async()=>{
      try{
        const response = await getEpicDetails({epicId,projectId})

       setEpicDetails(response || [])

      }catch(error){
        if(error instanceof Error){
          console.log(error)
        }

      }
    }
    getEpic()
    
  },[epicId,projectId])
  console.log(epicDetails)
 
  return (
    
    <section
      className="fixed w-full p-5   z-50 bg-black/45  inset-0 min-h-screen flex flex-col
     justify-center items-center "
    >
     
      <div className="bg-white max-h-[90vh]  overflow-y-scroll md:mt-10  max-sm:mt-16  w-full max-w-2xl p-8 flex flex-col gap-5">
        {epicDetails.map((item)=>{
          return(
            <>
            <div className='flex justify-between'>
               <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src={EpicsIcon} alt="EpicsIcon"></img>
            <p className="text-slate-dark font-bold text-[12px]">{item.epic_id}</p>
          </div>
          <h1 className="text-2xl font-bold">{item.description}</h1>
        </div>


  <button
    onClick={()=>modalStatus(false)}
    className="text-xl font-bold text-gray-600 hover:text-black"
  >
    ✕
  </button>

            </div>
        
        <div>
          <p className="font-medium ">
            A comprehensive review and upgrade of the core architectural
            frameworks.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-3">
            <UserInfo title="Created by" />
            <div>
              <div className="flex items-center gap-1">
                {/* avatar */}
                <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white text-[10px] font-bold">
                  AM
                </div>

                {/* info */}
                <div className="flex flex-col">
                  <h2 className="font-medium text-gray-900 text-sm">{item.created_by.name}</h2>
                </div>
         
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <UserInfo title="Assignee" />
            <div>
              <div className="flex items-center gap-1">
                {/* avatar */}
                <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white text-[10px] font-bold">
                  AM
                </div>

                {/* info */}
                <div className="flex flex-col">
                  <h2 className="font-medium text-gray-900 text-sm">{item.assignee.name}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <UserInfo title="Deadline" />

            <div>
              <div className="flex items-center gap-3">
                <img src={dateIcon} alt="date-icon"></img>

                {/* info */}
                <div className="flex flex-col">
                  <h2 className="font-medium text-gray-900">{item.deadline}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <UserInfo title="Created At" />

            <div>
              <div className="flex items-center gap-3">
                <img src={dateIcon} alt="date-icon"></img>

                {/* info */}
                <div className="flex flex-col">
                 <h2 className="font-medium text-gray-900">
  {new Date(item.created_at).toDateString()}
</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 ">
          <div className="flex justify-between">
            <p className="font-semibold text-lg">Tasks</p>
            <button className="text-primary font-semibold">+ Add Button</button>
          </div>
          <div className="min-h-64 bg-[#F1F3FF] p-2 flex flex-col  justify-center items-center">
            <div className="flex flex-col gap-3 items-center">
              <p className="font-medium">
                No tasks have been added to this epic yet
              </p>
              <button className="w-36 bg-blue-800 h-11 text-white">
                + Add Task
              </button>
            </div>
          </div>
        </div>
            </>
            
          )
        })}
       
      </div>
    </section>
  );
}
