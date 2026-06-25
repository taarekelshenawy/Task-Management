export type Task = {
  id: string;
  title: string;
  status: string;
};

const STATUSES = [
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
];

import TasksHeader from './TasksHeader';
// TasksBoardPage.tsx
import StatusColumn from './StatusColumn';
import { useLocation, useParams } from 'react-router-dom';
import ListView from './ListView';
import BreadCrumb from '../../shared/BreadCrumb';
import { useState } from 'react';
import TasksMobile from './TasksMobile';

export default function TasksContent() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get('view');
  const [searchValue,setSearchValue]=useState('');
  const {projectId}=useParams();
  

  return (
    <div className="p-6">
      <BreadCrumb items={[
        {label:'Projects',href:'/project'},
        {label:'PROJECT ALPHA',href:'/project'},
        {label:'TASKS'}
        ]}/>
      {/* Header */}
      <TasksHeader setSearchValue={setSearchValue}/>

      {/* Board */}
      {view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto max-sm:hidden">
          {STATUSES.map((status) => (
            <StatusColumn key={status} status={status}   searchValue={searchValue} />
          ))}
        </div>
      ) : (
        <ListView searchValue={searchValue}/>
      )}
     <TasksMobile searchValue={searchValue}/>
    </div>
  );
}
