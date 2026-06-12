import Sidebar from '../Componenets/Sidebar/leftSidebar';
import { Outlet, useParams } from 'react-router-dom';
import ProjectHeader from '../Componenets/ProjectHeader/ProjectHeader';

export default function Dashboard() {
  const { projectId } = useParams();
  if (!projectId) return null;

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
