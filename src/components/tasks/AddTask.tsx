import inviteIcon from '../../assets/InviteIcon.png';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import { AddProjectSchema } from '../../utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { handleEditProject } from '../../services/projectService';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProjectDetails } from '../../services/projectService';
import BreadCrumb from '../shared/BreadCrumb';
import type { projectProps } from '../../types/project';

export default function AddTask() {
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
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<projectProps>({
    resolver: zodResolver(AddProjectSchema),
  });

  const onSubmit: SubmitHandler<projectProps> = async (data) => {
    const payload = { ...data, projectId };
    try {
      await handleEditProject(payload);

      toast.success('Project Edit created successfully ');

      reset();
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
      <BreadCrumb
        items={[
          { label: 'Projects', href: '/project' },
          { label: 'Project Alpha', href: '/project' },
          { label: 'Tasks' },
          { label: 'New Task' },
        ]}
      />

      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <div>
          <h1 className="text-4xl font-semibold text-slate-dark">
            Create New Task
          </h1>
          <p className="text-secondary">
            Initialize a new work item within the Architectural Workspace
            ecosystem.
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
          className="shadow-form flex flex-col w-full mx-auto p-8 bg-white mt-9"
        >
          {/* FORM CONTENT */}
          <section className="flex flex-col gap-6">
            {/* Project Title */}
            <div className="flex flex-col gap-2">
              <label
                className="text-slate-md font-bold"
                htmlFor="project-title"
              >
                TITLE
              </label>

              <input
                {...register('name')}
                id="project-title"
                type="text"
                defaultValue={currentData[0]?.name}
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
            <div className="flex justify-between gap-4 items-center">
              <div className='flex-1 '>
                <label htmlFor="status"></label>
                <select id="status" defaultValue="To-Do"
                 className='bg-surface-high h-13 rounded px-3 w-full '
                >
                  <option>To Do</option>
                </select>
              </div>
              <div className='flex-1'>
                <label htmlFor="assignee">
                  <select id="assignee" defaultValue="Select Team Member" 
                  className='bg-surface-high h-13 rounded px-3 w-full '>
                    <option disabled> Select Team Member</option>
                  </select>
                </label>
              </div>
            </div>

            <div>
                  <div className='flex flex-col gap-3'>
                <label htmlFor="Epic" className='font-bold '>Epic</label>
                  <select id="Epic" defaultValue="Select Team Member" 
                  className='bg-surface-high h-13 rounded px-3 w-full '>
                    <option disabled> Select Epic Link</option>
                  </select>
            
              </div>
            </div>
            <div>
                 <div className='flex flex-col gap-3'>
                <label htmlFor="Epic" className='font-bold '>Due Date</label>
                  <input type='date'  className='bg-surface-high h-13 rounded px-3 w-full '></input>
            
              </div>
            </div>

         

            {/* Description */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-slate-md font-bold" htmlFor="description">
                Description
              </label>

              <textarea
                {...register('description')}
                defaultValue={currentData[0]?.description}
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
          <footer className="flex flex-col items-end max-sm:flex-col-reverse max-sm:gap-4 mt-6">
            <div className='flex gap-52'>
                       <button type="button" className="font-bold">
              Back
            </button>

            <button
              type="submit"
              className="cursor-pointer bg-primary text-white p-3 rounded-sm font-bold w-40"
            >
          Create Task
            </button>

            </div>
     
          </footer>

         
        </form>
      </section>
    </main>
  );
}
