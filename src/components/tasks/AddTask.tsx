import inviteIcon from '../../assets/InviteIcon.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import BreadCrumb from '../../shared/BreadCrumb';
import FetchGuard from '../../shared/ProjectMembersLoader';

import { useAppSelector } from '../../store/hooks';
import { createNewTask } from '../../services/taskService';

import type { CreateTaskPayload } from '../../types/tasks';
import { createTaskSchema } from '../../utils/validationSchema';

export default function AddTask() {
  const { projectId } = useParams();

  if (!projectId) {
    throw new Error('Project ID is missing');
  }

  const { data: epicDetails } = useAppSelector((state) => state.epics);
  const { members } = useAppSelector((state) => state.Project);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskPayload>({
    resolver: zodResolver(createTaskSchema),
  });

  // =========================
  // CREATE TASK
  // =========================
  const onSubmit = async (data: CreateTaskPayload) => {
    try {
      const payload: CreateTaskPayload = {
        epic_id: data.epic_id,
        title: data.title,
        description: data.description,
        assignee_id: data.assignee_id,
        due_date: data.due_date,
        status: data.status,
      };

      const response = await createNewTask({
        ...payload,
        project_id: projectId,
      });

      console.log('Task Created:', response);

      toast.success('Task created successfully');

      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <main className="p-7">
      <BreadCrumb
        items={[
          { label: 'Projects', href: '/project' },
          { label: 'Project Alpha', href: '/project' },
          { label: 'Tasks' },
          { label: 'New Task' },
        ]}
      />

      <FetchGuard projectId={projectId} />

      {/* HEADER */}
      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <div>
          <h1 className="text-4xl font-semibold text-slate-dark">
            Create New Task
          </h1>
          <p className="text-secondary">
            Initialize a new work item within the system
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
          <img src={inviteIcon} />
          <span className="font-bold">Invite Member</span>
        </button>
      </section>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-form flex flex-col w-full mx-auto p-8 bg-white mt-9"
      >
        <section className="flex flex-col gap-6">
          {/* TITLE */}
          <div className="flex flex-col gap-2">
            <label className="font-bold">TITLE</label>

            <input
              {...register('title')}
              className="bg-surface-high h-13 rounded px-3"
              placeholder="Task title"
            />

            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* STATUS + ASSIGNEE */}
          <div className="flex justify-between gap-4">
            {/* STATUS */}
            <div className="flex-1">
              <select
                {...register('status')}
                className="bg-surface-high h-13 rounded px-3 w-full"
              >
                <option value="" disabled hidden>
                  Select Status
                </option>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>

              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            {/* ASSIGNEE */}
            <div className="flex-1">
              <select
                {...register('assignee_id')}
                className="bg-surface-high h-13 rounded px-3 w-full"
              >
                <option value="" disabled>
                  None (Optional)
                </option>

                {members.map((el) => (
                  <option key={el.user_id} value={el.user_id}>
                    {el.metadata.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* EPIC */}
          <div>
            <label className="font-bold">Epic</label>

            <select
              {...register('epic_id')}
              className="bg-surface-high h-13 rounded px-3 w-full"
            >
              <option value="" disabled>
                Select Epic
              </option>

              {epicDetails.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.title}
                </option>
              ))}
            </select>

            {errors.epic_id && (
              <p className="text-red-500 text-sm">{errors.epic_id.message}</p>
            )}
          </div>

          {/* DUE DATE */}
          <div>
            <label className="font-bold">Due Date</label>

            <input
              type="date"
              {...register('due_date')}
              className="bg-surface-high h-13 rounded px-3 w-full"
            />

            {errors.due_date && (
              <p className="text-red-500 text-sm">{errors.due_date.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-bold">Description</label>

            <textarea
              {...register('description')}
              className="bg-surface-high w-full h-37 rounded px-3 p-2"
              placeholder="Task description..."
            />

            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded font-bold w-40"
          >
            Create Task
          </button>
        </footer>
      </form>
    </main>
  );
}
