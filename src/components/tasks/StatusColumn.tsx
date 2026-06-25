import { useEffect, useRef, useState } from 'react';
import { fetchTasks } from '../../services/taskService';
import TaskCard from './TaskCard';
import { useNavigate, useParams } from 'react-router-dom';
import type { TaskProps } from '../../types/tasks';
import { Link } from 'react-router-dom';

type StatusColumnProps = {
  status: string;
  searchValue: string;
};

const LIMIT = 2;

export default function StatusColumn({
  status,
  searchValue,
}: StatusColumnProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const statusColor = {
    TO_DO: 'bg-status-todo',
    IN_PROGRESS: 'bg-status-in-progress',
    BLOCKED: 'bg-status-blocked',
    IN_REVIEW: 'bg-status-default',
    READY_FOR_QA: 'bg-status-default',
    REOPENED: 'bg-status-default',
    READY_FOR_PRODUCTION: 'bg-status-default',
    DONE: 'bg-status-default',
  };

  const loadTasks = async (reset = false) => {
    if (!projectId) return;

    try {
      setLoading(true);

      const currentOffset = reset ? 0 : offset;

      const data = await fetchTasks(
        projectId,
        status,
        searchValue,
        LIMIT,
        currentOffset,
      );

      if (reset) {
        setTasks(data);
      } else {
        setTasks((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === LIMIT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setTasks([]);
    loadTasks(true);
  }, [projectId, status, searchValue]);

  // Load More
  useEffect(() => {
    if (offset === 0) return;

    loadTasks();
  }, [offset]);

  // Infinite Scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setOffset((prev) => prev + LIMIT);
        }
      },
      {
        rootMargin: '150px',
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="rounded-xl p-3 w-72 shrink-0 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              statusColor[status as keyof typeof statusColor]
            }`}
          />

          <span className="text-sm font-semibold">{status}</span>

          <span className="w-5 h-5 rounded text-center bg-gray-400 text-white">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() =>
            navigate(
              `/project/${projectId}/tasks/new?status=${encodeURIComponent(
                status,
              )}`,
            )
          }
          className="text-lg font-bold text-blue-600"
        >
          +
        </button>
      </div>

      <div className="w-full h-13 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer">
        <Link to={`/project/${projectId}/tasks/new`}>
          <span className="text-gray-500 font-medium">+ ADD NEW TASK</span>
        </Link>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {loading && (
          <p className="text-center text-sm text-gray-500">Loading...</p>
        )}

        {hasMore && <div ref={loadMoreRef} className="h-4" />}
      </div>
    </div>
  );
}
