import { useParams } from 'react-router-dom';
import EpicsIcon from '../../assets/EpicsModal.png';
import dateIcon from '../../assets/dateIcon.png';
import UserInfo from './UserInfo';
import { getEpicDetails } from '../../services/epicsService';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import FetchGuard from '../shared/FetchGuard';
import { updateEpicDetails } from '../../services/epicsService';

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

type Payload = {
  title: string;
  description: string;
  assignee_id: string;
  deadline: string;
};

export default function DetailsModal({
  epicId,
  modalStatus,
}: {
  epicId: string;
  modalStatus: (status: boolean) => void;
}) {
  const [epicDetails, setEpicDetails] = useState<EpicDetails[]>([]);
  const { projectId } = useParams();
  const { members } = useAppSelector((state) => state.Project);

  const [updateData, setUpdateData] = useState<Payload>({
    title: '',
    description: '',
    assignee_id: '',
    deadline: '',
  });

  // ✅ loading state للـ update
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ useRef لتجنب stale closure
  const updateDataRef = useRef(updateData);
  useEffect(() => {
    updateDataRef.current = updateData;
  }, [updateData]);

  if (!projectId) {
    throw new Error('there is no id');
  }

  const getInitials = (name: string = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');

  useEffect(() => {
    const getEpic = async () => {
      try {
        const response = await getEpicDetails({ epicId, projectId });
        const data = response || [];
        setEpicDetails(data);

        // ✅ تهيئة updateData من البيانات المجلوبة
        if (data.length > 0) {
          const item = data[0];
          setUpdateData({
            title: item.title || '',
            description: item.description || '',
            assignee_id: item.assignee?.sub || '',
            deadline: item.deadline || '',
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
        }
      }
    };
    getEpic();
  }, [epicId, projectId]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ updateEpic مع loading state و debounce
  const updateEpic = useCallback(
    (payload: Payload) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        setIsUpdating(true);
        try {
          const response = await updateEpicDetails({ epicId, payload });
          setEpicDetails(response || []);
        } catch (error) {
          if (error instanceof Error) {
            console.log(error);
          }
        } finally {
          setIsUpdating(false);
        }
      }, 500);
    },
    [epicId],
  );

  return (
    <section
      className="fixed w-full p-5   z-50 bg-black/45  inset-0 min-h-screen flex flex-col
     justify-center items-center  "
    >
      <FetchGuard projectId={projectId!} />
      <div className="bg-white max-h-[90vh]  overflow-y-scroll md:mt-10  max-sm:mt-16  w-full max-w-2xl p-8 flex flex-col gap-10">
        {/* ✅ Loading indicator للـ update */}
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

        {epicDetails?.map((item) => {
          const name = item.created_by.name ?? '';
          const initials = getInitials(name);
          return (
            // ✅ key للـ map
            <div key={item.id} className="flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-2">
                    <img src={EpicsIcon} alt="EpicsIcon"></img>
                    <p className="text-slate-dark font-bold text-[12px]">
                      {item.epic_id}
                    </p>
                  </div>
                  {/* ✅ controlled input بـ updateData.description */}
                  <input
                    type="text"
                    className="w-full h-9 p-2 px-3 bg-surface-high"
                    value={updateData.description}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newData = {
                        ...updateDataRef.current,
                        description: value,
                      };
                      setUpdateData(newData);
                      updateEpic(newData);
                    }}
                  />
                </div>
                <button
                  onClick={() => modalStatus(false)}
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

              <div className="flex justify-between gap-3 max-sm:flex-wrap">
                <div className="flex flex-col gap-3">
                  <UserInfo title="Created by" />
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-[#0052CC] flex items-center justify-center text-white text-[10px] font-bold">
                        {initials}
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
                        {initials}
                      </div>
                      {/* ✅ controlled select */}
                      <select
                        value={updateData.assignee_id}
                        onChange={(e) => {
                          const value = e.target.value;
                          const newData = {
                            ...updateDataRef.current,
                            assignee_id: value,
                          };
                          setUpdateData(newData);
                          updateEpic(newData);
                        }}
                      >
                        <option value="" disabled>
                          Select assignee
                        </option>
                        {members.map((el) => (
                          <option key={el.user_id} value={el.user_id}>
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
                        {/* ✅ controlled date input */}
                        <input
                          type="date"
                          value={updateData.deadline}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newData = {
                              ...updateDataRef.current,
                              deadline: value,
                            };
                            setUpdateData(newData);
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
                      <img src={dateIcon} alt="date-icon"></img>
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
                  <button className="text-primary font-semibold">
                    + Add Button
                  </button>
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
