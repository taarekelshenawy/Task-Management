import { useEffect, useState } from 'react';
import { fetchAllTasks } from '../../services/taskService';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TaskModal from './TaskModal';
import Emptystate from '../ui/Emptystate';
import { TotalFromContentRange } from '../../shared/TotalformContentRange';
import { getInitials } from '../../utils/Helper';
import type { AllTaskProps } from '../../types/tasks';
import { toast } from 'react-toastify';
import Pagination from '../../shared/Pagination';

export default function ListView({ searchValue }: { searchValue: string }) {
  const { projectId } = useParams();
  const [allTasks, setAllTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contentRange, setContentRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  useEffect(() => {
    if (!projectId) return;
    const getTasks = async () => {
      try {
        setLoading(true);
        const response = await fetchAllTasks(
          projectId,
          limit,
          offset,
          searchValue,
        );

        if (!response.ok) {
          toast.error('Failed to fetch tasks');
        }

        const data = await response.json();

        setAllTasks(data);
        setContentRange(response.headers.get('Content-Range') || '');
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        if (error instanceof Error) {
          setError(error?.message);
        }

        setLoading(false);
      }
    };

    getTasks();
  }, [projectId, offset, searchValue]);

  const total = TotalFromContentRange(contentRange);

  const totalPages = Math.ceil(total / limit);
  console.log(allTasks);

  // ===== Empty State =====
  if (allTasks.length === 0 && !loading && !error) {
    return (
      <Emptystate
        title={searchValue ? 'No tasks found matching your search' : 'No Tasks'}
        description={
          searchValue
            ? 'Try a different search term'
            : 'You don’t have any epics yet. Start by creating your first task.'
        }
        buttonText="+ Create New Task"
        link={`/project/${projectId}/tasks/new`}
      />
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[250px] bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mb-1">
          تعذر تحميل البيانات
        </h3>

        <p className="text-sm text-slate-500 max-w-sm mb-4">
          يبدو أن هناك مشكلة في الاتصال بالإنترنت أو الخادم. يرجى التحقق من
          الشبكة والمحاولة مرة أخرى.
        </p>

        <button
          onClick={() => window.location.reload()} // أو ممكن تستبدلها بدالة الـ refetch لو متاحفة
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl shadow-sm"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-sm:hidden">
      <table className="min-w-225 w-full text-center  border-separate border-spacing-0 bg-white">
        <thead className=" font-extrabold text-secondary bg-background uppercase">
          <tr>
            <th className="py-4 font-extrabold ">Task ID</th>
            <th className="py-4 font-extrabold">Title</th>
            <th className="py-4 font-extrabold">Status</th>
            <th className="py-4 font-extrabold">Due Date</th>
            <th className="py-4 font-extrabold">Assignee</th>
            <th className="py-4 font-extrabold"></th>
          </tr>
        </thead>

        <tbody className="font-medium">
          {allTasks?.map((el: AllTaskProps) => {
            return (
              <tr className="bg-white " key={el.task_id}>
                <td className="py-4 text-primary font-medium cursor-pointer">
                  {el.task_id}
                </td>
                <td
                  className="py-4 font-bold cursor-pointer"
                  onClick={() => {
                    return (setTaskId(el.id), setOpenModal(true));
                  }}
                >
                  {el.title}
                </td>
                <td className=" py-4 ">
                  <span className="bg-surface-high  px-3 py-1 rounded-full text-sm">
                    {el.status}
                  </span>
                </td>
                <td className="py-4">{new Date(el.due_date).toDateString()}</td>
                <td className="py-4">
                  <div className="flex items-center justify-center  gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-high flex items-center justify-center">
                      {getInitials(el.assignee.name)}
                    </div>
                    <p>{el.assignee.name ? el.assignee.name : 'unAsssigned'}</p>
                  </div>
                </td>
                <td className="py-4">
                  <button>⋯</button>
                </td>
              </tr>
            );
          })}
        </tbody>

        {allTasks.length <= limit ? (
          <></>
        ) : (
          <tfoot>
            <tr>
              <td colSpan={6}>
                {/* Pagination UI only */}
                <Pagination
                  pageItemsCount={allTasks.length}
                  totalItems={total}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="flex justify-end mt-80">
        <Link to={`/project/:${projectId}/tasks/new`}>
          <button className="bg-primary w-18 h-15 rounded-xl text-3xl text-white cursor-pointer">
            +
          </button>
        </Link>
      </div>
      {openModal && (
        <TaskModal
          projectId={projectId!}
          taskId={taskId}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}
