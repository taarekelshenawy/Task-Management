import { Link, useParams } from 'react-router-dom';
import EpicsIcon from '../../assets/EpicsModal.png';
import dateIcon from '../../assets/dateIcon.png';
import UserInfo from './UserInfo';
import { useEffect, useState, useCallback, useRef } from 'react';
import FetchGuard from '../../shared/ProjectMembersLoader';
import { updateEpicDetails } from '../../services/epicsService';
import getEpicTasks from '../../services/taskService';
import containerIcon from '../../assets/Container.png';
import type { PayloadEpics } from '../../types/epics';
import type { epicsTasksProps } from '../../types/epics';
import { fetchEpicDetails } from '../../Store/epicsSlice';
import { useAppDispatch } from '../../Store/hooks';
import { useAppSelector } from '../../Store/hooks';
import { getInitials } from '../../utils/Helper';
import { useNavigate } from 'react-router-dom';

// SKELETON COMPONENT
function DetailsModalSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-2/3 bg-gray-200 rounded" />
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>

      <div className="flex justify-between gap-3 max-sm:flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="min-h-64 bg-[#F1F3FF] p-5 flex flex-col justify-center w-full gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between w-full max-sm:flex-wrap gap-4"
            >
              <div className="flex gap-2 items-center w-full">
                <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="flex gap-1 items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-200" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-12 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DetailsModal({
  epicId,
  modalStatus,
}: {
  epicId: string;
  modalStatus: (status: boolean) => void;
}) {
  const { projectId } = useParams();
  const { members } = useAppSelector((state) => state.Project);
  const [epicsTasks, setEpicsTasks] = useState([]);
  const dispatch = useAppDispatch();
  const { data: epicDetails } = useAppSelector((state) => state.epics);
  const [editing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const navigate = useNavigate();

  const updateDataRef = useRef({
    title: '',
    description: '',
    assignee_id: '',
    deadline: '',
  });

  if (!projectId) {
    throw new Error('there is no id');
  }

  useEffect(() => {
    setIsLoadingDetails(true);
    dispatch(fetchEpicDetails({ epicId, projectId })).finally(() => {
      setIsLoadingDetails(false);
    });
  }, [dispatch, epicId, projectId]);

  useEffect(() => {
    if (epicDetails?.length > 0) {
      const item = epicDetails[0];

      updateDataRef.current = {
        title: item.title || '',
        description: item.description || '',
        assignee_id: item.assignee?.sub || '',
        deadline: item.deadline || '',
      };
    }
  }, [epicDetails]);

  useEffect(() => {
    const handleEpicTasks = async () => {
      try {
        const data = await getEpicTasks(epicId);
        if (data.length != 0) {
          setEpicsTasks(data);
        }
      } catch (error) {
        alert(error);
      }
    };
    handleEpicTasks();
  }, [epicId]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateEpic = useCallback(
    (payload: PayloadEpics) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        setIsUpdating(true);
        try {
          await updateEpicDetails({ epicId, payload });
          navigate(`/project/${projectId}/epics`);

          dispatch(fetchEpicDetails({ epicId, projectId }));
        } catch (error) {
          if (error instanceof Error) {
            console.log(error);
          }
        } finally {
          setIsUpdating(false);
        }
      }, 1000);
    },
    [epicId, dispatch, projectId, navigate],
  );

  return (
    <section
      className="fixed w-full p-5   z-50 bg-black/45  inset-0 min-h-screen flex flex-col
     justify-center items-center  "
    >
      <FetchGuard projectId={projectId!} />
      <div className="bg-white max-h-[90vh]  overflow-y-scroll md:mt-10  max-sm:mt-16  w-full max-w-2xl p-8 flex flex-col gap-10">
        {isUpdating && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded">
            <svg
              className="animate-spin h-4 w-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Saving...</span>
          </div>
        )}

        {isLoadingDetails ? (
          <DetailsModalSkeleton />
        ) : (
          epicDetails?.map((item) => {
            return (
              <div key={item.id} className="flex flex-col gap-5">
                <div className="flex justify-between items-start ">
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex items-center gap-2">
                      <img src={EpicsIcon} alt="EpicsIcon"></img>
                      <p className="text-slate-dark font-bold text-[12px]">
                        {item.epic_id}
                      </p>
                    </div>
                    <p
                      className=" font-bold hover:cursor-text"
                      onClick={() => setIsEditing(true)}
                    >
                      {item.description}
                    </p>
                    {editing && (
                      <input
                        autoFocus
                        type="text"
                        className="w-full h-9 p-2 px-3 bg-surface-high"
                        defaultValue={item.description}
                        onBlur={(e) => {
                          const value = e.target.value;
                          const newData = {
                            ...updateDataRef.current,
                            description: value,
                          };
                          updateDataRef.current = newData;
                          updateEpic(newData);
                          setIsEditing(false);
                        }}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => modalStatus(false)}
                    className="text-xl font-bold text-gray-600 hover:text-black cursor-pointer"
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

                <div className="flex justify-between gap-3 max-sm:flex-wrap">
                  <div className="flex flex-col gap-3">
                    <UserInfo title="Created by" />
                    <div>
                      <div className="flex items-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white text-[10px] font-bold">
                          {getInitials(item.created_by.name)}
                        </div>
                        <div className="flex flex-col">
                          <h2 className="font-medium text-gray-900 text-sm">
                            {item.created_by.name}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <UserInfo title="Assignee" />
                    <div>
                      <div className="flex items-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {getInitials(item.created_by.name)}
                        </div>
                        {/*  controlled select */}
                        <select
                          className="cursor-pointer"
                          defaultValue={item.assignee.sub}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newData = {
                              ...updateDataRef.current,
                              assignee_id: value,
                            };
                            updateDataRef.current = newData;
                            updateEpic(newData);
                          }}
                        >
                          <option value="" disabled>
                            Select assignee
                          </option>
                          {members.map((el) => (
                            <option
                              key={el.user_id}
                              value={el.user_id}
                              className="cursor-pointer"
                            >
                              {el.metadata.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <UserInfo title="Deadline" />
                    <div>
                      <div className="flex items-center gap-3">
                        <img src={dateIcon} alt="date-icon"></img>
                        <div className="flex flex-col">
                          {/*  controlled date input */}
                          <input
                            type="date"
                            className="cursor-pointer"
                            defaultValue={item.deadline}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newData = {
                                ...updateDataRef.current,
                                deadline: value,
                              };
                              updateDataRef.current = newData;
                              updateEpic(newData);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <UserInfo title="Created At" />
                    <div>
                      <div className="flex items-center gap-3">
                        <img src={dateIcon} alt="date-icon "></img>
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
                    <Link to={`/project/${projectId}/tasks/new`}>
                      <button className="text-primary font-semibold cursor-pointer">
                        + Add Task
                      </button>
                    </Link>
                  </div>
                  <div className="min-h-64 bg-[#F1F3FF] p-5 flex flex-col justify-center   w-full">
                    <div className="flex flex-col  gap-3 items-center w-full">
                      {epicsTasks.length === 0 ? (
                        <p className="font-medium">
                          No tasks have been added to this epic yet
                        </p>
                      ) : (
                        epicsTasks?.map((el: epicsTasksProps) => {
                          return (
                            <div className="flex justify-between w-full max-sm:flex-wrap gap-4">
                              <div className="flex gap-2 items-center">
                                <img src={containerIcon} alt=""></img>
                                <div>
                                  <h1 className="font-medium text-lg">
                                    {el.title}
                                  </h1>
                                  <div className="flex gap-1 items-center">
                                    <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white font-bold">
                                      {getInitials(el.created_by.name)}
                                    </div>
                                    <p>{el.created_by.name}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-slate-dark/40 text-[10px]">
                                  Due Date
                                </p>
                                <p className="font-medium text-slate-dark/70 text-[12px]">
                                  {new Date(el.due_date).toDateString()}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

// import { Link, useParams } from 'react-router-dom';
// import EpicsIcon from '../../assets/EpicsModal.png';
// import dateIcon from '../../assets/dateIcon.png';
// import UserInfo from './UserInfo';
// import { useEffect, useState, useCallback, useRef } from 'react';
// import FetchGuard from '../../shared/ProjectMembersLoader';
// import { updateEpicDetails } from '../../services/epicsService';
// import getEpicTasks from '../../services/taskService';
// import containerIcon from '../../assets/Container.png';
// import type { PayloadEpics } from '../../types/epics';
// import type { epicsTasksProps } from '../../types/epics';
// import { fetchEpicDetails } from '../../store/epicsSlice';
// import { useAppDispatch } from '../../store/hooks';
// import { useAppSelector } from '../../store/hooks';
// import { getInitials } from '../../utils/Helper';
// import { useNavigate } from 'react-router-dom';

// export default function DetailsModal({
//   epicId,
//   modalStatus,
// }: {
//   epicId: string;
//   modalStatus: (status: boolean) => void;
// }) {
//   const { projectId } = useParams();
//   const { members } = useAppSelector((state) => state.Project);
//   const [epicsTasks, setEpicsTasks] = useState([]);
//   const dispatch = useAppDispatch();
//   const { data: epicDetails } = useAppSelector((state) => state.epics);
//   const [editing, setIsEditing] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const navigate = useNavigate();

//   const updateDataRef = useRef({
//     title: '',
//     description: '',
//     assignee_id: '',
//     deadline: '',
//   });

//   if (!projectId) {
//     throw new Error('there is no id');
//   }

//   useEffect(() => {
//     dispatch(fetchEpicDetails({ epicId, projectId }));
//   }, [dispatch, epicId, projectId]);

//   useEffect(() => {
//     if (epicDetails?.length > 0) {
//       const item = epicDetails[0];

//       updateDataRef.current = {
//         title: item.title || '',
//         description: item.description || '',
//         assignee_id: item.assignee?.sub || '',
//         deadline: item.deadline || '',
//       };
//     }
//   }, [epicDetails]);

//   useEffect(() => {
//     const handleEpicTasks = async () => {
//       try {
//         const data = await getEpicTasks(epicId);
//         if (data.length != 0) {
//           setEpicsTasks(data);
//         }
//       } catch (error) {
//         alert(error);
//       }
//     };
//     handleEpicTasks();
//   }, [epicId]);

//   const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const updateEpic = useCallback(
//     (payload: PayloadEpics) => {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);

//       debounceTimer.current = setTimeout(async () => {
//         setIsUpdating(true);
//         try {
//           await updateEpicDetails({ epicId, payload });
//           navigate(`/project/${projectId}/epics`);

//           dispatch(fetchEpicDetails({ epicId, projectId }));
//         } catch (error) {
//           if (error instanceof Error) {
//             console.log(error);
//           }
//         } finally {
//           setIsUpdating(false);
//         }
//       }, 1000);
//     },
//     [epicId, dispatch, projectId, navigate],
//   );

//   return (
//     <section
//       className="fixed w-full p-5   z-50 bg-black/45  inset-0 min-h-screen flex flex-col
//      justify-center items-center  "
//     >
//       <FetchGuard projectId={projectId!} />
//       <div className="bg-white max-h-[90vh]  overflow-y-scroll md:mt-10  max-sm:mt-16  w-full max-w-2xl p-8 flex flex-col gap-10">
//         {isUpdating && (
//           <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded">
//             <svg
//               className="animate-spin h-4 w-4 text-blue-600"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"
//               />
//             </svg>
//             <span>Saving...</span>
//           </div>
//         )}

//         {epicDetails?.map((item) => {
//           return (
//             <div key={item.id} className="flex flex-col gap-5">
//               <div className="flex justify-between items-start ">
//                 <div className="flex flex-col gap-4 w-full">
//                   <div className="flex items-center gap-2">
//                     <img src={EpicsIcon} alt="EpicsIcon"></img>
//                     <p className="text-slate-dark font-bold text-[12px]">
//                       {item.epic_id}
//                     </p>
//                   </div>
//                   <p
//                     className=" font-bold hover:cursor-text"
//                     onClick={() => setIsEditing(true)}
//                   >
//                     {item.description}
//                   </p>
//                   {editing && (
//                     <input
//                       autoFocus
//                       type="text"
//                       className="w-full h-9 p-2 px-3 bg-surface-high"
//                       defaultValue={item.description}
//                       onBlur={(e) => {
//                         const value = e.target.value;
//                         const newData = {
//                           ...updateDataRef.current,
//                           description: value,
//                         };
//                         updateDataRef.current = newData;
//                         updateEpic(newData);
//                         setIsEditing(false);
//                       }}
//                     />
//                   )}
//                 </div>

//                 <button
//                   onClick={() => modalStatus(false)}
//                   className="text-xl font-bold text-gray-600 hover:text-black cursor-pointer"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div>
//                 <p className="font-medium ">
//                   A comprehensive review and upgrade of the core architectural
//                   frameworks.
//                 </p>
//               </div>

//               <div className="flex justify-between gap-3 max-sm:flex-wrap">
//                 <div className="flex flex-col gap-3">
//                   <UserInfo title="Created by" />
//                   <div>
//                     <div className="flex items-center gap-1">
//                       <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white text-[10px] font-bold">
//                         {getInitials(item.created_by.name)}
//                       </div>
//                       <div className="flex flex-col">
//                         <h2 className="font-medium text-gray-900 text-sm">
//                           {item.created_by.name}
//                         </h2>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-3">
//                   <UserInfo title="Assignee" />
//                   <div>
//                     <div className="flex items-center gap-1">
//                       <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
//                         {getInitials(item.created_by.name)}
//                       </div>
//                       {/*  controlled select */}
//                       <select
//                       className='cursor-pointer'
//                         defaultValue={item.assignee.sub}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           const newData = {
//                             ...updateDataRef.current,
//                             assignee_id: value,
//                           };
//                           updateDataRef.current = newData;
//                           updateEpic(newData);
//                         }}
//                       >
//                         <option value="" disabled>
//                           Select assignee
//                         </option>
//                         {members.map((el) => (
//                           <option key={el.user_id} value={el.user_id} className='cursor-pointer'>
//                             {el.metadata.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-3">
//                   <UserInfo title="Deadline" />
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <img src={dateIcon} alt="date-icon" ></img>
//                       <div className="flex flex-col">
//                         {/*  controlled date input */}
//                         <input
//                           type="date"
//                           className='cursor-pointer'
//                           defaultValue={item.deadline}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             const newData = {
//                               ...updateDataRef.current,
//                               deadline: value,
//                             };
//                             updateDataRef.current = newData;
//                             updateEpic(newData);
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-3">
//                   <UserInfo title="Created At" />
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <img src={dateIcon} alt="date-icon " ></img>
//                       <div className="flex flex-col">
//                         <h2 className="font-medium text-gray-900">
//                           {new Date(item.created_at).toDateString()}
//                         </h2>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-5 ">
//                 <div className="flex justify-between">
//                   <p className="font-semibold text-lg">Tasks</p>
//                   <Link to={`/project/${projectId}/tasks/new`}>
//                     <button className="text-primary font-semibold cursor-pointer">
//                       + Add Task
//                     </button>
//                   </Link>
//                 </div>
//                 <div className="min-h-64 bg-[#F1F3FF] p-5 flex flex-col justify-center   w-full">
//                   <div className="flex flex-col  gap-3 items-center w-full">
//                     {epicsTasks.length === 0 ? (
//                       <p className="font-medium">
//                         No tasks have been added to this epic yet
//                       </p>
//                     ) : (
//                       epicsTasks?.map((el: epicsTasksProps) => {
//                         return (
//                           <div className="flex justify-between w-full max-sm:flex-wrap gap-4">
//                             <div className="flex gap-2 items-center">
//                               <img src={containerIcon} alt=""></img>
//                               <div>
//                                 <h1 className="font-medium text-lg">
//                                   {el.title}
//                                 </h1>
//                                 <div className="flex gap-1 items-center">
//                                   <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white font-bold">
//                                     {getInitials(el.created_by.name)}
//                                   </div>
//                                   <p>{el.created_by.name}</p>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-center">
//                               <p className="font-bold text-slate-dark/40 text-[10px]">
//                                 Due Date
//                               </p>
//                               <p className="font-medium text-slate-dark/70 text-[12px]">
//                                 {new Date(el.due_date).toDateString()}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
