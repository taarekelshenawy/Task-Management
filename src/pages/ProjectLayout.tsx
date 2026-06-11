import React from 'react';
import ProjectSidebar from '../Componenets/Sidebar/ProjectSidebar';
import { Outlet } from 'react-router-dom';

export default function ProjectLayout() {
  return (
    <div className="flex w-full">
      <ProjectSidebar />
      <div className='w-full'>
      <Outlet/>
      </div>
    
    </div>
  );
}
