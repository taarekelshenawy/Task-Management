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

export default function TaskDetails({
  task,
  setOpenModal,
  setTask,
}: {
  task: TaskDetailsProps;
  setOpenModal: (e: boolean) => void;
  setTask: React.Dispatch<React.SetStateAction<TaskDetailsProps | null>>;
}) {
  const options = [{ value: task?.assignee.name, label: task?.assignee.name }];
  const optionsEpic = [
    { value: task?.epic.epic_id, label: task?.epic.epic_id },
  ];

  const { projectId } = useParams();

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
                <div className="ml-2 flex  items-center gap-2">
                  <Select
                    options={optionsEpic}
                    value={optionsEpic.find(
                      (option) => option.value === task.epic?.epic_id,
                    )}
                    onChange={(selected) => {
                      if (!selected?.value) return;
                      handleTaskUpdate(
                        task.id,
                        setTask,
                        selected.value,
                        'epic_id',
                      );
                    }}
                  />

                  <p>({task.epic.title})</p>
                </div>
              </div>
            </div>

            <input
              defaultValue={task.title}
              onBlur={handleTitleBlur}
              className="font-bold text-3xl mt-3 max-sm:text-2xl outline-none hover:border-b"
              required
            />
          </div>

          <div className="mt-6 grid grid-cols-2 sm:hidden gap-3 max-sm:block">
            {/* Assignee */}
            <div className="p-2 bg-surface-low flex flex-col gap-2">
              <p className="font-bold">Assignee</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
                  {getInitials(task.assignee.name)}
                </div>
                <p className="text-sm">{task?.assignee?.name}</p>
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
              <p className="text-sm">{task?.assignee?.name}</p>
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
            className="px-4 py-2"
              defaultValue={task.description}
              onBlur={(e) => {
                const newDescription = e.target.value;

                if (!newDescription || newDescription === task.description)
                  return;

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
              <p>Copy link</p>
            </div>
            <button
              onClick={() => setOpenModal(false)}
              className="bg-surface-high w-18 h-7 cursor-pointer"
            >
              close
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="bg-slate-lighter flex-1 p-7 flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <label htmlFor="status">Status</label>

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

          {task?.assignee?.name ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
                {getInitials(task?.assignee?.name)}
              </div>

              <Select
                options={options}
                value={options.find(
                  (option) => option.value === task.assignee?.id,
                )}
                onChange={(selected) => {
                  if (!selected?.value) return;

                  handleTaskUpdate(
                    task.id,
                    setTask,
                    selected.value,
                    'assignee_id',
                  );
                }}
              />
            </div>
          ) : (
            <p className="text-sm">Unassigned</p>
          )}

          <div className="flex flex-col gap-4">
            <p>Reporter</p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-surface-high flex justify-center items-center">
                {getInitials(`${task?.assignee?.name}`)}
              </div>
              <div>
                <p>{task?.assignee?.name}</p>
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
