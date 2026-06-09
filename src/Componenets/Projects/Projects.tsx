import { useEffect, useState } from 'react';
import { GetProjects } from '../../services/projectService';
import { data } from 'react-router-dom';
import EmptyIcon from '../../assets/EmptyIcon.png';

type Project = {
  name: string;
  description: string;
  created_at: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await GetProjects();
        const data = await response.json();

        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      {data.length === 0 ? (
        <div className="flex flex-col  justify-center items-center gap-5">
          <div className="max-w-75 text-center flex flex-col gap-5">
            <img src={EmptyIcon} className="max-w-[288px]"></img>
            <h1 className="font-bold text-2xl">No Projects</h1>
            <p>
              You don’t have any projects yet. Start by defining your first
              architectural workspace to begin tracking tasks and epics.
            </p>
            <div className="flex justify-center">
              <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
                <span className="font-bold">+ Create New Project</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-7">
          <section className="max-sm:hidden flex justify-between items-center mt-7">
            <div>
              <h1 className="text-4xl font-semibold text-slate-dark">
                Projects
              </h1>
              <p className="font-medium text-secondary">
                Manage and curate your projects
              </p>
            </div>

            <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
              <span className="font-bold">+ Create New Project</span>
            </button>
          </section>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-sm:grid-cols-1">
            {projects.map((project) => (
              <div
                key={`${project.name}-${project.created_at}`}
                className="bg-white max-w-76 rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-[220px]"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {project.name}
                  </h3>

                  <p className="text-sm text-slate-600 font-bold">
                    {project.description || 'No description provided'}
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <p className="text-xs text-slate-500">Created at</p>

                  <time className="text-sm font-medium text-slate-700">
                    {formatDate(project.created_at)}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}


