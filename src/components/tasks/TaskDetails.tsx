import epicIcon from '../../assets/epicIcon.png';
import copyIcon from '../../assets/copyIcon.png';
import { formatDate } from '../../utils/Helper';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { handleTaskUpdate } from '../../utils/Helper';
import { getInitials } from '../../utils/Helper';
import { updateTask } from '../../services/taskService';
import { useParams } from 'react-router-dom';
import type { TaskDetailsProps } from '../../types/tasks';
import { STATUS_OPTIONS } from '../constants/constants';
import { useAppSelector } from '../../store/hooks';
import ProjectMembersLoader from '../../shared/ProjectMembersLoader';
import UnassignedIcon from '../../assets/unassigned.svg';

export default function TaskDetails({
  task,
  setOpenModal,
  setTask,
}: {
  task: TaskDetailsProps;
  setOpenModal: (e: boolean) => void;
  setTask: React.Dispatch<React.SetStateAction<TaskDetailsProps | null>>;
}) {
  const { members } = useAppSelector((state) => state.Project);
  const options = [
    { value: null, label: 'Unassigned' },
    ...members.map((member) => ({
      value: member.user_id,
      label: member.metadata.name,
    })),
  ];

  const { projectId } = useParams();
  console.log(task);
  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim();
    if (!newTitle) {
      e.target.value = task.title;
      return;
    }
    if (newTitle === task?.title) return;
    try {
      if (!task?.id) return;
      await updateTask(task.id, {
        title: newTitle,
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', projectId],
      });
      toast.success('Task title updated');
    } catch {
      toast.error('Failed to update title');
    }
  };

  const queryClient = useQueryClient();
  return (
    <>
      <ProjectMembersLoader projectId={projectId!} />
      <form className="flex md:max-w-4xl w-full bg-white">
        <div className="flex-2 p-7">
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between mb-4 sm:hidden ">
            <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
              <p>{task.task_id}</p>
            </p>

            <button
              className="text-lg font-bold cursor-pointer"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
                {task.task_id}
              </p>
              <div className="flex items-center">
                <img src={epicIcon} />

                <div className="ml-2 flex  items-center ">
                  <p>{task.epic.epic_id}</p>

                  <p>({task.title})</p>
                </div>
              </div>
            </div>

            <input
              defaultValue={task.title}
              onBlur={handleTitleBlur}
              className="font-bold text-3xl mt-4 max-sm:text-2xl outline-none hover:border-b"
              required
            />
          </div>

          <div className="mt-6 grid grid-cols-2 sm:hidden gap-3 max-sm:block">
            {/* Assignee */}
            <div className="p-2 bg-surface-low flex flex-col gap-2">
              <p className="font-bold">Assignee</p>
              <div className="flex items-center gap-2">
                <p className="text-sm">{task.assignee?.name || ''}</p>
              </div>
            </div>

            {/* Due Date */}
            <div className="p-2 bg-surface-low flex flex-col gap-1">
              <p className="text-xs text-gray-500">Due Date</p>
              <input
                type="Date"
                className="text-sm"
                value={task.due_date?.split('T')[0]}
                // {...register('due_date')}
              ></input>
            </div>

            {/* Reporter */}
            <div className="p-2 bg-surface-low flex flex-col gap-2">
              <p className="font-bold">Reporter</p>
              <p className="text-sm">{task.assignee?.name || ''}</p>
            </div>

            {/* Created At */}
            <div className="p-2 bg-surface-low flex flex-col gap-1">
              <p className="text-xs text-gray-500">Created At</p>
              {/* <p >22 Oct 2025</p> */}
              <p className="text-sm">{formatDate(task.created_at)}</p>
            </div>
          </div>

          {/* DESCRIPTION (LAST in mobile) */}
          <div className={`flex flex-col gap-4 max-sm:mt-6 mt-16`}>
            <h3 className="font-bold text-secondary">Description</h3>
            <textarea
              className="px-2 py-2 font-bold text-slate-dark"
              defaultValue={
                task.description === null
                  ? 'No description provided'
                  : task.description
              }
              onBlur={(e) => {
                let newDescription = e.target.value || null;

                if (!newDescription) {
                  newDescription = null;
                }

                handleTaskUpdate(
                  task.id,
                  setTask,
                  newDescription,
                  'description',
                );
              }}
            />
          </div>

          {/* FOOTER */}

          <div className="mt-32 flex justify-between ">
            <div className="flex items-center gap-2">
              <img src={copyIcon} />
              <p className="font-bold text-secondary">Copy link</p>
            </div>
            <button
              onClick={() => setOpenModal(false)}
              className="bg-surface-high w-18 h-9 cursor-pointer rounded"
            >
              close
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="bg-slate-lighter flex-1 p-7 flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <label htmlFor="status" className="font-bold">
              Status
            </label>

            <Select
              value={{
                value: task.status,
                label: task.status,
              }}
              options={STATUS_OPTIONS}
              onChange={async (selected) => {
                if (!selected) return;

                handleTaskUpdate(task.id, setTask, selected.value, 'status');
                queryClient.invalidateQueries({
                  queryKey: ['tasks', projectId],
                });
              }}
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-bold">Assignee</p>

            <div className="flex items-center gap-3 bg-white p-2 rounded-lg">
              {!task.assignee?.id ? (
                <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
                  <img
                    src={UnassignedIcon}
                    alt="Unassigned"
                    className="w-3 h-3"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-surface-high flex items-center justify-center text-[11px] font-bold">
                  {getInitials(task.assignee.name)}
                </div>
              )}

              <Select
                className="w-full border-none"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: 'none',
                    boxShadow: 'none',
                  }),
                }}
                options={options}
                value={options.find(
                  (option) => option.value === (task.assignee?.id ?? null),
                )}
                onChange={(selected) => {
                  handleTaskUpdate(
                    task.id,
                    setTask,
                    selected!.value || null,
                    'assignee_id',
                    members,
                  );
                  queryClient.invalidateQueries({
                    queryKey: ['tasks', projectId],
                  });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p>Reporter</p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-surface-high flex items-center justify-center text-[11px] font-bold">
                {getInitials(`${task?.created_by?.name || ''}`)}
              </div>
              <div>
                <p>{task?.created_by?.name}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p>Due Date</p>
              <input
                type="date"
                defaultValue={task.due_date?.split('T')[0]}
                onChange={(e) => {
                  const newDate = e.target.value || null;
                  if (!newDate) return;
                  handleTaskUpdate(task.id, setTask, newDate, 'due_date');
                }}
              />
            </div>
            <div className="flex justify-between">
              <p>Created At</p>
              <p>{new Date(task.created_at).toDateString()}</p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
