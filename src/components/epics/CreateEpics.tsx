import inviteIcon from '../../assets/InviteIcon.png';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import TipIcon from '../../assets/TipIcon.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { createNewEpic } from '../../services/epicsService';
import { useAppSelector } from '../../store/hooks';
import { AddProjectEpicsSchema } from '../../utils/validationSchema';
import { useParams } from 'react-router-dom';
import FetchGuard from '../shared/FetchGuard';
import BreadCrumb from '../shared/BreadCrumb';

type Inputs = {
  title: string;
  description: string;
  deadline: string;
};

export default function Epics() {
  const { projectId } = useParams();
  const { members } = useAppSelector((state) => state.Project);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(AddProjectEpicsSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    const data = {
      ...payload,
      assignee_id: members[0]?.user_id,
      project_id: members[0]?.project_id,
    };

    try {
      await createNewEpic(data);

      toast.success('projectEpic created successfully 🚀');

      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to create project: ${error.message}`);
      } else {
        toast.error('Something went wrong');
      }
    }
  };
  return (
    <main className="p-7">
      <FetchGuard projectId={projectId!} />

      <BreadCrumb
        items={[
          { label: 'PROJECTS', href: '/project' },
          { label: 'Project Alpha', href: '/project' },
          { label: 'Epics' },
          { label: 'New Epic' },
        ]}
      />

      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <div>
          <h1 className="text-4xl font-semibold text-slate-dark">
            Create New Epic
          </h1>
          <p>
            Define a major project phase or high-level milestone to group
            related tasks and track architectural progress.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
          <img src={inviteIcon} />
          <span className="font-bold">Invite Member</span>
        </button>
      </section>

      <section>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow-form flex flex-col max-w-2xl mx-auto p-8 bg-white mt-9"
        >
          {/* FORM CONTENT */}
          <section className="flex flex-col gap-6">
            {/* Project Title */}
            <div className="flex items-center gap-6 ">
              <label
                className="text-slate-md font-bold basis-[30%] "
                htmlFor="project-title"
              >
                TITLE
              </label>

              <input
                {...register('title')}
                id="project-title"
                type="text"
                className="bg-surface-high h-13 rounded px-3 w-full"
                placeholder="Pr"
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex items-center gap-6">
              <label
                className=" basis-[30%] text-slate-md font-bold"
                htmlFor="description"
              >
                Description
              </label>

              <textarea
                {...register('description')}
                id="description"
                className="bg-surface-high w-full h-37 rounded px-3 p-2"
                placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center gap-4 max-sm:flex-wrap">
              <div className="flex flex-col gap-3 basis-93.5 ">
                <label htmlFor="member-select ">Assignee</label>

                {/* React controls the value here */}
                <select
                  id="member-select"
                  className="w-full h-11 p-2 bg-surface-high"
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                    className="font-medium text-slate-dark"
                  >
                    Select a member...
                  </option>

                  {members.map((el) => (
                    <option value={el.id} key={el.id}>
                      {el.metadata.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <label htmlFor="Deadline">Deadline</label>
                <input
                  {...register('deadline')}
                  id="Deadline"
                  type="date"
                  className="bg-surface-high h-12 p-2 rounded"
                ></input>
              </div>
            </div>
          </section>

          {/* FORM FOOTER */}
          <footer className="flex justify-between items-center max-sm:flex-col-reverse max-sm:gap-4 mt-6">
            <button type="button" className="font-bold">
              Back
            </button>

            <button
              type="submit"
              className="cursor-pointer bg-primary text-white p-3 rounded-sm font-bold w-40"
            >
              Create Epic
            </button>
          </footer>

          {/* TIP */}
          <aside className="w-full bg-surface-low p-2 flex gap-1 mt-3">
            <img src={TipIcon} className="w-3 h-4" />
            <p className="font-bold text-slate-md text-[11px]">
              Pro Tip: You can invite project members and assign epics
              immediately after the initial creation process.
            </p>
          </aside>
        </form>
      </section>
    </main>
  );
}
