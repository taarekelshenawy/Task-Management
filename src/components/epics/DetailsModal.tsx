import { Link, useParams } from 'react-router-dom';
import EpicsIcon from '../../assets/EpicsModal.png';
import dateIcon from '../../assets/dateIcon.png';
import UserInfo from './UserInfo';
import { useEffect, useState, useCallback, useRef } from 'react';
import { updateEpicDetails } from '../../services/epicsService';
import getEpicTasks from '../../services/taskService';
import containerIcon from '../../assets/Container.png';
import type { PayloadEpics } from '../../types/epics';
import type { epicsTasksProps } from '../../types/epics';
import { fetchEpicDetails, getProjectEpics } from '../../store/epicsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getInitials } from '../../utils/Helper';
import DetailsModalSkeleton from './DetailsModalSkeleton';
import FetchGuard from '../../shared/ProjectMembersLoader';

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
  const { data: epicDetails, loading } = useAppSelector((state) => state.epics);
  const [isUpdating, setIsUpdating] = useState(false);

  const [updatedData, setUpdatedData] = useState({
    title: '',
    description: '',
    assignee_id: '',
    deadline: '',
  });

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchEpicDetails({ epicId, projectId })).finally(() => {});
  }, [dispatch, epicId, projectId]);

  useEffect(() => {
    if (!loading && epicDetails && epicDetails.length > 0) {
      const item = epicDetails[0];
      setUpdatedData({
        title: item.title || '',
        description: item.description || '',
        assignee_id: item.assignee?.sub || '',
        deadline: item.deadline || '',
      });
    }
  }, [loading, epicDetails]);

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
      if (!projectId) return;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        setIsUpdating(true);
        try {
          await updateEpicDetails({ epicId, payload });
          await dispatch(fetchEpicDetails({ epicId, projectId }));
          await dispatch(getProjectEpics({ projectId, limit: 3, offset: 0 }));
        } catch (error) {
          if (error instanceof Error) {
            console.log(error);
          }
        } finally {
          setIsUpdating(false);
        }
      }, 1000);
    },
    [epicId, dispatch, projectId],
  );
  if (!projectId) {
    return;
  }

  return (
    <section
      className="fixed w-full p-5   z-50 bg-black/45  inset-0 min-h-screen flex flex-col
     justify-center items-center  "
    >
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
        <FetchGuard projectId={projectId} />

        {loading ? (
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

                    <input
                      value={updatedData.description}
                      onChange={(e) =>
                        setUpdatedData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      onBlur={() => updateEpic(updatedData)}
                    />
                  </div>

                  <button
                    onClick={async () => {
                      modalStatus(false);
                    }}
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
                          value={updatedData.assignee_id}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newData = {
                              ...updatedData,
                              assignee_id: value,
                            };

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
                            value={updatedData.deadline}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newData = {
                                ...updatedData,
                                deadline: value,
                              };
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
                        epicsTasks?.map((el: epicsTasksProps, index) => {
                          return (
                            <div
                              key={index}
                              className="flex justify-between w-full max-sm:flex-wrap gap-4"
                            >
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
