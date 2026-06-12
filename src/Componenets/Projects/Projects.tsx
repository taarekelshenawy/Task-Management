import { useEffect, useMemo, useRef, useState } from 'react';
import { GetProjects } from '../../services/projectService';
import EmptyIcon from '../../assets/EmptyIcon.png';
import arrowRight from '../../assets/arrowRight.png';
import arrowLeft from '../../assets/arrowleft.png';
import { Link } from 'react-router-dom';
import ProjectSkeleton from './ProjectSkelton';

type Project = {
  id?: string;
  name: string;
  description: string;
  created_at: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentRange, setContentRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 639px)').matches,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const windowSize = 5;

  const limit = 3;
  const offset = (currentPage - 1) * limit;

  // ===== Parse Content Range safely =====
  const parsed = useMemo(() => {
    if (!contentRange) {
      return {
        total: 0,
        start: 0,
        end: 0,
        displayedCount: 0,
        totalPages: 0,
      };
    }
    const [range, total] = contentRange.split('/');
    const [start, end] = range.split('-').map(Number);
    const totalNumber = Number(total);

    return {
      total: totalNumber,
      start,
      end,
      displayedCount: projects.length,
      totalPages: Math.ceil(totalNumber / limit),
    };
  }, [contentRange, projects.length, limit]);

  const { total, displayedCount, totalPages } = parsed;

  // ===== Mobile detection (matches Tailwind max-sm: 639px) =====
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      setCurrentPage(1);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // ===== Fetch Projects =====
  useEffect(() => {
    const fetchProjects = async () => {
      const isLoadMore = isMobile && currentPage > 1;

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError('');
      try {
        const response = await GetProjects({ limit, offset });
        const data = await response.json();
        const contentRangeHeader = response.headers.get('Content-Range') || '';

        setContentRange(contentRangeHeader);

        if (isLoadMore) {
          setProjects((prev) => [...prev, ...(data || [])]);
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProjects();
  }, [offset, isMobile, currentPage]);

  // ===== Infinite scroll (mobile only) =====
  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !loadingMore &&
          currentPage < totalPages
        ) {
          setCurrentPage((page) => page + 1);
        }
      },
      { rootMargin: '120px' },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isMobile, loading, loadingMore, currentPage, totalPages]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ===== Empty State =====
  if (!loading && projects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="max-w-75 text-center flex flex-col gap-5">
          <img src={EmptyIcon} className="max-w-[288px]" />
          <h1 className="font-bold text-2xl">No Projects</h1>
          <p>
            You don’t have any projects yet. Start by creating your first
            workspace.
          </p>

          <div className="flex justify-center">
            <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
              <span className="font-bold">+ Create New Project</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getVisiblePages = (current: number, total: number) => {
    const pages: number[] = [];
    let start = current;
    let end = start + windowSize - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - windowSize + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="p-7 flex flex-col gap-12">
      {/* Header */}
      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <div>
          <h1 className="text-4xl font-semibold text-slate-dark">Projects</h1>
          <p className="font-medium text-secondary">
            Manage and curate your projects
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
          <Link to="add">
            {' '}
            <span className="font-bold">+ Create New Project</span>
          </Link>
        </button>
      </section>

      {/* Loading */}
      {loading && projects.length === 0 && <ProjectSkeleton count={limit} />}

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Projects Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-sm:grid-cols-1">
        {projects.map((project) => (
          <Link to={`/project/${project.id}/epics/new`}>
            <div
              key={project.id || `${project.name}-${project.created_at}`}
              className="bg-white max-w-76 max-h-80 rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55"
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

              <div className="flex justify-end mt-4">
                <Link
                  to={`/project/${project.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-20 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-all duration-200 shadow-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Infinite scroll sentinel (mobile only) */}
      {isMobile && currentPage < totalPages && (
        <div ref={loadMoreRef} className="h-1 sm:hidden" aria-hidden="true" />
      )}

      {loadingMore && (
        <div className="sm:hidden">
          <ProjectSkeleton count={1} />
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between bg-white p-4 items-center">
        <p className="font-bold text-secondary">
          Showing {displayedCount} of {total} active projects
        </p>

        <div className="max-sm:hidden flex items-center gap-2">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer disabled:opacity-40"
          >
            <img src={arrowLeft} className="w-1 h-2" />
          </button>

          {getVisiblePages(currentPage, totalPages).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer disabled:opacity-40"
          >
            <img src={arrowRight} className="w-1 h-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
