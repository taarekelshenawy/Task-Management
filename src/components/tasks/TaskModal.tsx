
import { getInitials } from '../../utils/Helper';
import epicIcon from '../../assets/epicIcon.png';
import copyIcon from '../../assets/copyIcon.png';
import { useEffect, useState } from 'react';
import { getTaskDetails } from '../../services/taskService';

const statusStyles = {
  todo: "bg-gray-200 text-gray-700",
  "in progress": "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function TaskModal({projectId,taskId}) {
  const [isMobile, setIsMobile] = useState(false);
  const [task, setTask] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const status = task?.status?.toLowerCase();


 useEffect(() => {
  if (!projectId || !taskId) return;

  const fetchTask = async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await getTaskDetails(projectId, taskId);
      setTask(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchTask();
}, [projectId, taskId]);

  


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize(); // أول render

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 text-white">
      Loading...
    </div>
  );
}

if (error) {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 text-white">
      Failed to load task details
    </div>
  );
}

if (!task) {
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 text-white">
      Task not found
    </div>
  );
}

  return (
    <div className="z-50 px-6 py-4 flex flex-col justify-center items-center max-sm:justify-end max-sm:p-0 fixed top-0 inset-0 bg-black/35 ">

      <div className="flex max-w-4xl bg-white">

        {/* LEFT SIDE */}
        <div className="flex-2 p-7">

          {/* MOBILE HEADER */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
                TASK-125
              </p>

              <button className="text-lg font-bold">✕</button>
            </div>
          )}

          <div>
            {!isMobile &&
               <div className="flex items-center gap-2">
              <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
                TASK-125
              </p>
              <div className="flex items-center">
                <img src={epicIcon} />
                <p className="ml-2">EPIC-102 (Core UI Overhaul)</p>
              </div>
            </div>
            }
         

            <h1 className="font-bold text-3xl mt-3 max-sm:text-2xl">
               {task.title}
            </h1>
          </div>

          {/* ASSIGNEE + META (mobile reordered) */}
          {/* {isMobile && (
            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className=" p-2 bg-surface-low">
                <p className="font-bold">Assignee</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
                    {getInitials('Mahmoud Taha')}
                  </div>
                  <p className="text-sm">Mahmoud Taha</p>
                </div>
              </div>

              <div className="flex justify-between col-span-2 text-sm">

                <p>22 Oct 2025</p>
              </div>

              <div className="bg-white p-2">
                <p className="font-bold">Reporter</p>
                <p className="text-sm">Mahmoud Taha</p>
              </div>

              

              <div className="flex flex-col max-w-41.5 p-2 justify-center col-span-2 text-sm bg-surface-low h-20 ">
                <div>
                                    <p>Created At</p>
                <p>22 Oct 2025</p>

                </div>

              </div>
            </div>
          )} */}

          {isMobile && (
  <div className="mt-6 grid grid-cols-2 gap-3">

    {/* Assignee */}
    <div className="p-2 bg-surface-low flex flex-col gap-2">
      <p className="font-bold">Assignee</p>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
          {getInitials('Mahmoud Taha')}
        </div>
        <p className="text-sm">Mahmoud Taha</p>
      </div>
    </div>
    
    {/* Due Date */}
    <div className="p-2 bg-surface-low flex flex-col gap-1">
      <p className="text-xs text-gray-500">Due Date</p>
      {/* <p >22 Oct 2025</p> */}
      <p className="text-sm">{formatDate(task.due_date)}</p>
    </div>

    {/* Reporter */}
    <div className="p-2 bg-surface-low flex flex-col gap-2">
      <p className="font-bold">Reporter</p>
      <p className="text-sm">Mahmoud Taha</p>
    </div>


    {/* Created At */}
    <div className="p-2 bg-surface-low flex flex-col gap-1">
      <p className="text-xs text-gray-500">Created At</p>
      {/* <p >22 Oct 2025</p> */}
      <p className="text-sm">{formatDate(task.created_at)}</p>
    </div>

  </div>
)}

          {/* DESCRIPTION (LAST in mobile) */}
          <div className={`flex flex-col gap-4 ${isMobile ? 'mt-6' : 'mt-16'}`}>
            <h3 className="font-bold text-secondary">Description</h3>
            <p className="font-medium leading-6">
                {task.description || "No description"}
            </p>
          </div>

          {/* FOOTER */}
          {!isMobile &&
             <div className="mt-32 flex justify-between ">
            <div className="flex items-center gap-2">
              <img src={copyIcon} />
              <p>Copy link</p>
            </div>
              <button className="bg-surface-high w-18 h-7 cursor-pointer">
                close
              </button>

          </div>
          }
       
        </div>

        {/* RIGHT SIDE */}
        {!isMobile && (
          <div className="bg-slate-lighter flex-1 p-7 flex flex-col gap-7">
     
<span className={`px-2 py-1 text-xs rounded ${statusStyles[status]}`}>
 {task.status}
</span>
{task.assignee_name ? (
  <>
    <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
      {getInitials(task.assignee_name)}
    </div>
    <p className="text-sm">{task.assignee_name}</p>
  </>
) : (
  <p className="text-sm">Unassigned</p>
)}
            {/* <div className="flex flex-col gap-4">
              <p className="font-bold">Assignee</p>
              <div className="flex items-center gap-3 bg-white p-2">
                <div className="w-7 h-7 rounded-full bg-surface-high flex justify-center items-center">
                  {getInitials('Mahmoud Taha')}
                </div>
                <div>
                  <p>Mahmoud Taha</p>
                  <p>Senior Frontend Engineer</p>
                </div>
              </div>
            </div> */}

            <div className="flex flex-col gap-4">
              <p>Reporter</p>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-high flex justify-center items-center">
                  {getInitials('Mahmoud Taha')}
                </div>
                <div>
                  <p>Mahmoud Taha</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <p>Due Date</p>
                <p>22 Oct 2025</p>
              </div>
              <div className="flex justify-between">
                <p>Created At</p>
                <p>22 Oct 2025</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}



// import Select from 'react-select/base';
// import { getInitials } from '../../utils/Helper';
// import epicIcon from '../../assets/epicIcon.png';
// import copyIcon from '../../assets/copyIcon.png';
// import { useEffect, useState } from 'react';

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];


// export default function TaskModal() {
//     const [isMobile,setIsMobile]=useState(false);


//     useEffect(()=>{
//         const resize =()=> window.addEventListener('resize',()=>{
//             if(window.innerWidth <600){
//                 setIsMobile(true)
//             }else{
//                 setIsMobile(false)
//             }
//         })
//         resize()
//         return ()=>window.removeEventListener('resize',resize)

//     },[])
//   return (
//     <div className="z-50 px-6 py-4  flex flex-col justify-center items-center fixed top-0 inset-0 bg-black/35">
//       <div className="flex max-w-4xl">
//         <div className="bg-white flex-2 p-7">
//           <div>
//             <div className="flex items-center gap-2">
//               <p className="text-primary font-bold w-19 text-center rounded  h-5 bg-surface-high">
//                 TASK-125
//               </p>
//               <div className="flex items-center">
//                 <img src={epicIcon}></img>
//                 <p className="ml-2"> EPIC-102 (Core UI Overhaul)</p>
//               </div>
//             </div>

//             <h1 className="font-bold text-3xl mt-3">
//               Implement glassmorphism effect on modals
//             </h1>
//           </div>
//           <div className="mt-16 flex flex-col gap-4">
//             <h3 className="font-bold text-secondary ">Description</h3>
//             <p className="font-medium leading-6">
//               Detailed task description goes here. This involves updating the
//               modal container background to use semi-transparent surface colors
//               with a 20px backdrop-blur to align with the Digital Curator
//               aesthetic. Ensure contrast ratios remain accessible.
//             </p>
//           </div>

//           <div className="mt-50 flex justify-between">
//             <div className="flex items-center gap-2">
//               <img src={copyIcon}></img>
//               <p>Copy link</p>
//             </div>
//             <button className="bg-surface-high w-18 h-7 cursor-pointer">
//               close
//             </button>
           
//           </div>
//         </div>
//         <div className="bg-slate-lighter flex-1 p-7 flex flex-col gap-7">
//           <Select options={options} />
//           <div className="flex flex-col gap-4 ">
//             <p className="font-bold">Assignee</p>
//             <div className="flex items-center gap-3 bg-white p-2 ">
//               <div className="w-7 h-7 rounded-full bg-surface-high flex justify-center items-center">
//                 {getInitials('Mahmoud Taha')}
//               </div>
//               <div>
//                 <p>Mahmoud Taha</p>
//                 <p>Senior Frontend Engineer</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <p>Reporter</p>
//             <div className="flex items-center gap-3">
//               <div className="w-7 h-7 rounded-full bg-surface-high flex justify-center items-center">
//                 {getInitials('Mahmoud Taha')}
//               </div>
//               <div>
//                 <p>Mahmoud Taha</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <div className="flex justify-between">
//               <p>Due Date</p>
//               <p>22 Oct 2025</p>
//             </div>
//             <div className="flex justify-between">
//               <p>Created At</p>
//               <p>22 Oct 2025</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isMobile &&
//       <>
//          <div className="flex items-center gap-2 justify-between">
//               <p className="text-primary font-bold w-19 text-center rounded  h-5 bg-surface-high">
//                 TASK-125
//               </p>
//               <button>x</button>
//         </div>
//          <h1 className="font-bold text-3xl mt-3">
//               Implement glassmorphism effect on modals
//          </h1>
//       </>
//       }
//     </div>
//   );
// }
