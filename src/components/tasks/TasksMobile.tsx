import TaskCard from './TaskCard';
import { useEffect } from 'react';
import { useState } from 'react';
import { fetchAllTasks } from '../../services/taskService';
import { useParams } from 'react-router-dom';

type AllTaskProps = {
  id: string;
  task_id: string;
  title: string;
  assignee: { name: string };
  due_date: string;
  status: string;
};

export default function TasksMobile({ searchValue }: { searchValue: string }) {
  const [allTasks, setAllTasks] = useState<AllTaskProps[]>([]);
  const { projectId } = useParams();
  const limit = 10;
  const offset = 0;

  useEffect(() => {
    const getTasks = async () => {
      if (!projectId) return;
      const response = await fetchAllTasks(
        projectId,
        limit,
        offset,
        searchValue,
      );

      const data = await response.json();

      setAllTasks(data);
    };

    getTasks();
  }, [projectId, searchValue]);
  return (
    <div className="hidden max-sm:block">
      {allTasks?.map((task) => {
        return (
          <div className="mb-5">
            <TaskCard task={task} />
          </div>
        );
      })}
    </div>
  );
}
