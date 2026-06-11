import arrowIcon from '../../assets/arrowIcon.png';
import inviteIcon from '../../assets/InviteIcon.png';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import BentoIcon from '../../assets/BentoIcon.png';
import TipIcon from '../../assets/TipIcon.png';
import { AddProjectSchema } from '../../utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { handleEditProject } from '../../services/projectService';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProjectDetails } from '../../services/projectService';

type Inputs = {
  name: string;
  description: string;
};

export default function EditProject() {
  const [currentData, setCurrentData] = useState([
    { name: '', description: '' },
  ]);

  const { projectId } = useParams();
  if (!projectId) {
    throw new Error('Project ID is missing');
  }

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await getProjectDetails({ projectId });

        const data = await response.json();
        setCurrentData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjectDetails();
  }, [projectId]);
  console.log(currentData[0].name);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(AddProjectSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const payload = { ...data, projectId };
    try {
      await handleEditProject(payload);

      toast.success('Project created successfully 🚀');

      reset(); // يمسح الفورم بعد النجاح
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to Edit project: ${error.message}`);
      } else {
        toast.error('Something went wrong');
      }
    }
  };
  return (
    <main className="p-7">
      <header className="flex items-center gap-2 max-sm:hidden">
        <p className="font-bold text-secondary">PROJECTS</p>
        <img src={arrowIcon} className="w-2" />
        <p className="font-bold text-primary">Edit Project</p>
      </header>

      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <h1 className="text-4xl font-semibold text-slate-dark">Edit Project</h1>

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
          {/* FORM HEADER */}
          <header className="flex items-center gap-2 mb-9">
            <div className="max-sm:hidden w-11 h-11 bg-primary-container/10 flex justify-center items-center">
              <img src={BentoIcon} />
            </div>

            <div>
              <h2 className="text-3xl font-semibold">Edit Project</h2>
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
                value={currentData[0].name}
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
                value={currentData[0].description}
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
            <button type="button" className="font-bold">
              Back
            </button>

            <button
              type="submit"
              className="cursor-pointer bg-primary text-white p-3 rounded-sm font-bold w-40"
            >
              Save
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
