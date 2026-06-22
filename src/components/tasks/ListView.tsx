import arrowLeft from '../../assets/arrowleft.png';
import arrowRight from '../../assets/arrowRight.png';
import { useEffect, useState } from 'react';
import { fetchAllTasks } from '../../services/taskService';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

type AllTaskProps = {
  task_id: string;
  title: string;
  assignee: { name: string };
  due_date: string;
  status: string;
};

export default function ListView() {
  const { projectId } = useParams();
  const [allTasks, setAllTasks] = useState([]);
  if (!projectId) {
    throw new Error('there is no projectId');
  }

  useEffect(() => {
    fetchAllTasks(projectId).then(setAllTasks);
  }, [projectId]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-225 w-full text-center  border-separate border-spacing-0">
        <thead className="font-extrabold text-secondary bg-background uppercase">
          <tr>
            <th className="py-4 font-extrabold">Task ID</th>
            <th className="py-4 font-extrabold">Title</th>
            <th className="py-4 font-extrabold">Status</th>
            <th className="py-4 font-extrabold">Due Date</th>
            <th className="py-4 font-extrabold">Assignee</th>
            <th className="py-4 font-extrabold"></th>
          </tr>
        </thead>

        <tbody className="font-medium">
          {allTasks.map((el: AllTaskProps) => {
            return (
              <tr className="bg-white">
                <td className="py-4">{el.task_id}</td>
                <td className="py-4">{el.title}</td>
                <td className="py-4">{el.status}</td>
                <td className="py-4">{el.due_date}</td>
                <td className="py-4">{el.assignee.name}</td>
                <td className="py-4">
                  <button>⋯</button>
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={6}>
              <div className="flex justify-between bg-white p-4 items-center w-full">
                <p className="font-bold text-secondary">
                  Showing 5 of 24 tasks
                </p>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 border flex items-center justify-center">
                    <img src={arrowLeft} className="w-1 h-2" />
                  </button>
                  <button className="w-8 h-8 border flex items-center justify-center">
                    <img src={arrowRight} className="w-1 h-2" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="flex justify-end mt-80">
        <Link to={`/project/:${projectId}/tasks/new`}>
          <button className="bg-primary w-18 h-15 rounded-xl text-3xl text-white cursor-pointer">
            +
          </button>
        </Link>
      </div>
    </div>
  );
}
