import { getInitials } from '../../utils/Helper';
import epicIcon from '../../assets/epicIcon.png';
import copyIcon from '../../assets/copyIcon.png';
import { useEffect, useState } from 'react';
import { getTaskDetails } from '../../services/taskService';
import { formatDate } from '../../utils/Helper';
import type { TaskDetailsProps } from '../../types/tasks';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskModalSchema } from '../../utils/validationSchema';
import z from 'zod';
import { Controller } from 'react-hook-form';
import { updateTask } from '../../services/taskService';
import { toast } from 'react-toastify';
import { fetchTasks } from '../../services/taskService';

export default function TaskModal({
  projectId,
  taskId,
  setOpenModal,
}: {
  projectId: string;
  taskId: string;
  setOpenModal: (e: boolean) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [task, setTask] = useState<TaskDetailsProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
   const LIMIT = 100;
  const OFFSET = 0;
  // const { members } = useAppSelector((state) => state.Project);

   const options = [{ value: task?.assignee.name, label: task?.assignee.name }];
  const optionsStatus = [{ value: task?.status, label: task?.status }];
  const optionsEpic = [
    { value: task?.epic.epic_id, label: task?.epic.epic_id },
  ];


  type TaskModalInputs = z.infer<typeof taskModalSchema>;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskModalInputs>({
    resolver: zodResolver(taskModalSchema),
  });
  console.log(task?.due_date);
  const onSubmit: SubmitHandler<TaskModalInputs> = (data) => console.log(data);

  useEffect(() => {
    if (!projectId || !taskId) return;

    const fetchTask = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getTaskDetails(projectId, taskId);
        setTask(data);
      } catch (error: unknown) {
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

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim();

    if (newTitle === task?.title) return;
    try {
      if(!task?.id) return;
      await updateTask(task.id, {
        title: newTitle,
      });
      await fetchTasks(projectId,task.status,'',LIMIT, OFFSET);
      toast.success("Task title updated")
    } catch {
      toast.error('Failed to update title');
    }
  };
 


  // ui loading and error
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
      {/* <div className="flex md:max-w-4xl w-full bg-white"> */}
      {/* LEFT SIDE */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex md:max-w-4xl w-full bg-white"
      >
        <div className="flex-2 p-7">
          {/* MOBILE HEADER */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
                <p>{task.task_id || '-'}</p>
              </p>

              <button
                className="text-lg font-bold cursor-pointer"
                onClick={() => setOpenModal(false)}
              >
                ✕
              </button>
            </div>
          )}

          <div>
            {!isMobile && (
              <div className="flex items-center gap-2">
                <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
                  {task.task_id || '-'}
                </p>
                <div className="flex items-center">
                  <img src={epicIcon} />
                  <div className="ml-2 flex  items-center gap-2">
                    {/* {task.epic.epic_id}  */}
                    {/* <Controller
                      name="epic_id"
                      control={control}
                      defaultValue={task?.epic?.epic_id}
                      render={({ field }) => (
                        <Select
                          options={optionsEpic}
                          value={optionsEpic.find(
                            (option) => option.value === field.value,
                          )}
                          onChange={(selected) =>
                            field.onChange(selected?.value)
                          }
                          placeholder="Choose..."
                        />
                      )}
                    /> */}
                    <Controller
                      name="epic_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={optionsEpic}
                          value={optionsEpic.find(
                            (option) => option.value === field.value,
                          )}
                          onChange={async (selected) => {
                            if (!selected) return;

                            const previousTask = task;

                            field.onChange(selected.value);

                            setTask((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    epic: {
                                      ...prev.epic,
                                      epic_id: selected.value,
                                      name: selected.label,
                                    },
                                  }
                                : prev,
                            );

                            try {
                              await updateTask(task.id, {
                                epic_id: selected.value,
                              });
                            } catch {
                              setTask(previousTask);
                              field.onChange(previousTask.epic.epic_id);

                              toast.error('Failed to update epic');
                            }
                          }}
                        />
                      )}
                    />
                    {/* <Select
                      className="text-sm  gap-2"
                      // {...register('assignee_id')}
                      value={optionsEpic[0]}
                      // onChange={handleChange}
                      options={optionsEpic}
                      placeholder="Choose... assignee"
                    /> */}
                    <p>(Core UI Overhaul)</p>
                  </div>
                </div>
              </div>
            )}

            <input
              {...register('title')}
              defaultValue={task.title}
              // value={task.title}
              
              onBlur={handleTitleBlur}
              className="font-bold text-3xl mt-3 max-sm:text-2xl outline-none hover:border-b"
              required
            />
            {errors.title && <span>{errors.title.message}</span>}
            {/* </h1> */}
          </div>

          {isMobile && (
            <div className="mt-6 grid grid-cols-2 gap-3">
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
                {/* <p >22 Oct 2025</p> */}
                {/* <p className="text-sm">{}</p> */}
                <input
                  type="Date"
                  className="text-sm"
                  value={task.due_date?.split('T')[0]}
                  {...register('due_date')}
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
          )}

          {/* DESCRIPTION (LAST in mobile) */}
          <div className={`flex flex-col gap-4 ${isMobile ? 'mt-6' : 'mt-16'}`}>
            <h3 className="font-bold text-secondary">Description</h3>

            {/* <textarea
              value={task.description}
              {...register('description')}
              className="font-medium leading-6 px-2"
            /> */}
            <textarea
              defaultValue={task.description}
              {...register('description')}
              onBlur={async (e) => {
                const newDescription = e.target.value;

                if (newDescription === task.description) return;

                const previousTask = task;

                setTask((prev) =>
                  prev
                    ? {
                        ...prev,
                        description: newDescription,
                      }
                    : prev,
                );

                try {
                  await updateTask(task.id, {
                    description: newDescription,
                  });
                } catch {
                  setTask(previousTask);
                  toast.error('Failed to update description');
                }
              }}
            />
            {errors.title && <span>{errors.description?.message}</span>}
          </div>

          {/* FOOTER */}
          {!isMobile && (
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
          )}
        </div>

        {/* RIGHT SIDE */}
        {!isMobile && (
          <div className="bg-slate-lighter flex-1 p-7 flex flex-col gap-7">
            {/* <span
              className={`px-2 py-1 text-xs rounded ${
                statusStyles[task.status as keyof typeof statusStyles]
              }`}
            > */}
            <div className="flex flex-col gap-5">
              <label htmlFor="status">Status</label>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    options={optionsStatus}
                    value={optionsStatus.find(
                      (option) => option.value === field.value,
                    )}
                    onChange={async (selected) => {
                      if (!selected) return;

                      const previousTask = task;

                      field.onChange(selected.value);

                      setTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: selected.value,
                            }
                          : prev,
                      );

                      try {
                        await updateTask(task.id, {
                          status: selected.value,
                        });
                      } catch {
                        setTask(previousTask);
                        field.onChange(previousTask.status);

                        toast.error('Failed to update status');
                      }
                    }}
                  />
                )}
              />
            </div>

            {/* </span> */}

            {task?.assignee?.name ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
                  {getInitials(task?.assignee?.name)}
                </div>
                {/* <Controller
                  name="assignee_id"
                  control={control}
                  defaultValue={task?.assignee?.id}
                  render={({ field }) => (
                    <Select
                      options={options}
                      value={options.find(
                        (option) => option.value === field.value,
                      )}
                      onChange={(selected) => field.onChange(selected?.value)}
                      placeholder="Choose assignee..."
                    />
                  )}
                /> */}
                <Controller
                  name="assignee_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={options}
                      value={options.find(
                        (option) => option.value === field.value,
                      )}
                      onChange={async (selected) => {
                        if (!selected) return;

                        const previousTask = task;

                        field.onChange(selected.value);

                        setTask((prev) =>
                          prev
                            ? {
                                ...prev,
                                assignee: {
                                  ...prev.assignee,
                                  id: selected.value,
                                  name: selected.label,
                                },
                              }
                            : prev,
                        );

                        try {
                          await updateTask(task.id, {
                            assignee_id: selected.value,
                          });
                        } catch {
                          setTask(previousTask);
                          field.onChange(previousTask.assignee.id);

                          toast.error('Failed to update assignee');
                        }
                      }}
                    />
                  )}
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
                {/* <input
                  type="Date"
                  className="text-sm"
                  value={task.due_date?.split('T')[0]}
                  {...register('due_date')}
                ></input> */}

                <input
                  type="date"
                  defaultValue={task.due_date?.split('T')[0]}
                  onChange={async (e) => {
                    const newDate = e.target.value || null;

                    const previousTask = task;

                    setTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            due_date: newDate
                              ? `${newDate}T00:00:00+00:00`
                              : null,
                          }
                        : prev,
                    );

                    try {
                      await updateTask(task.id, {
                        due_date: newDate,
                      });
                    } catch {
                      setTask(previousTask);
                      toast.error('Failed to update due date');
                    }
                  }}
                />

                {errors.due_date && <span>This field is required</span>}
              </div>
              <div className="flex justify-between">
                <p>Created At</p>
                <p>{new Date(task.created_at).toDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* </div> */}
    </div>
  );
}
