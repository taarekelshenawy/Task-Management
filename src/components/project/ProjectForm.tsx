import inviteIcon from '../../assets/InviteIcon.png';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import BentoIcon from '../../assets/BentoIcon.png';
import TipIcon from '../../assets/TipIcon.png';
import { AddProjectSchema } from '../../utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProject } from '../../services/projectService';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import BreadCrumb from '../shared/BreadCrumb';
import type { projectProps } from '../../types/project';



export default function ProjectForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<projectProps>({
    resolver: zodResolver(AddProjectSchema),
  });

  const onSubmit: SubmitHandler<projectProps> = async (data) => {
    try {
      await CreateProject(data);
      toast.success('Project created successfully ');
      reset();
      navigate('/project', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to create project: ${error.message}`);
      }
    }
  };
  return (
    <main className="p-7">
      <BreadCrumb
        items={[
          { label: 'Projects', href: '/project' },
          { label: 'ADD NEW PROJECT' },
        ]}
      />

      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <h1 className="text-4xl font-semibold text-slate-dark">
          Add New Project
        </h1>
        <button className="flex items-center rounded-xs cursor-pointer gap-2 bg-primary w-45 h-11 justify-center text-white">
          <img src={inviteIcon} />
          <span className="font-bold">Invite Member</span>
        </button>
      </section>

      <section>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow-form flex flex-col max-w-2xl mx-auto p-8 bg-white mt-9"
        >
          {/* FORM HEADER */}
          <header className="flex items-center gap-2 mb-9">
            <div className="max-sm:hidden w-11 h-11 bg-primary-container/10 flex justify-center items-center">
              <img src={BentoIcon} />
            </div>

            <div>
              <h2 className="text-3xl font-semibold">Initialize New Project</h2>
              <p className="text-slate-md font-medium">
                Define the scope and foundational details of your project.
              </p>
            </div>
          </header>

          {/* FORM CONTENT */}
          <section className="flex flex-col gap-6">
            {/* Project Title */}
            <div className="flex flex-col gap-2">
              <label
                className="text-slate-md font-bold"
                htmlFor="project-title"
              >
                Project TITLE
              </label>

              <input
                {...register('name')}
                id="project-title"
                type="text"
                className="bg-surface-high h-13 rounded px-3"
                placeholder="Pr"
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-slate-md font-bold" htmlFor="description">
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
          </section>

          {/* FORM FOOTER */}
          <footer className="flex justify-between items-center max-sm:flex-col-reverse max-sm:gap-4 mt-6">
            <Link to="/project">
              <button type="button" className="font-bold">
                Back
              </button>
            </Link>

            <button
              type="submit"
              className="cursor-pointer bg-primary text-white p-3 rounded-sm font-bold w-40"
            >
              Create Project
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
