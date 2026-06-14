import Sidebar from '../components/sidebar/leftSidebar';
import { Outlet, useParams } from 'react-router-dom';
import ProjectHeader from '../components/project/ProjectHeader';

export default function ProjectLayout() {
  const { projectId } = useParams();


  return (
    <div className="flex">
      <Sidebar projectId={projectId} />

      <div className="flex flex-col w-full">
        <ProjectHeader />

        <Outlet />
      </div>
    </div>
  );
}
