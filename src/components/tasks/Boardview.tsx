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
import { useLocation } from 'react-router-dom';
import ListView from './ListView';
import BreadCrumb from '../../shared/BreadCrumb';

export default function Boardview() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get('view');

  return (
    <div className="p-6">
      <BreadCrumb items={[
        {label:'Projects',href:'/project'},
        {label:'PROJECT ALPHA',href:'/project'},
        {label:'TASKS'}
        ]}/>
      {/* Header */}
      <TasksHeader />

      {/* Board */}
      {view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto">
          {STATUSES.map((status) => (
            <StatusColumn key={status} status={status} />
          ))}
        </div>
      ) : (
        <ListView />
      )}
    </div>
  );
}
