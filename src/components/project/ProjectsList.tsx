import { useEffect, useMemo, useRef, useState } from 'react';
import { GetProjects } from '../../services/projectService';
import arrowRight from '../../assets/arrowRight.png';
import arrowLeft from '../../assets/arrowleft.png';
import { Link, useLocation } from 'react-router-dom';
import Skeleton from '../ui/Skelton';
import Emptystate from '../ui/Emptystate';
import type { projectListProps } from '../../types/project';
import dropDownIcon from '../../assets/dropDownIcon.png';

export default function ProjectsList() {
  const location = useLocation();
  const [projects, setProjects] = useState<projectListProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentRange, setContentRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 639px)').matches,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const limit = 3;
  const offset = (currentPage - 1) * limit;

  // ===== Parse Content Range safely =====
  const paginationInfo = useMemo(() => {
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

  const { total, displayedCount, totalPages } = paginationInfo;

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
  }, [offset, isMobile, currentPage, location.key]);

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

  return (
    <div className="p-7 flex flex-col gap-12">
      {!loading && projects.length === 0 ? (
        <>
          <Emptystate
            title="No Projects"
            description="You don’t have any projects yet. Start by creating your first workspace."
            buttonText="+ Create New Project"
            link="/project/add"
          />
        </>
      ) : (
        <>
          {/* Header */}
          <section className="max-sm:hidden flex justify-between items-center mt-7">
            <div>
              <h1 className="text-4xl font-semibold text-slate-dark">
                Projects
              </h1>
              <p className="font-medium text-secondary">
                Manage and curate your projects
              </p>
            </div>

            <button className="flex items-center  gap-2 bg-linear-to-br  from-[#003D9B] to-[#0052CC] w-45 h-11 rounded-xs justify-center text-white">
              <Link to="add">
                {' '}
                <span className="font-medium">+ Create New Project</span>
              </Link>
            </button>
          </section>

          {/* Loading */}
          {loading && projects.length === 0 && <Skeleton count={limit} />}

          {/* Error */}
          {error && <p className="text-center text-red-500">{error}</p>}
          {loading ? (
            <>
              <Skeleton count={3} />
            </>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-sm:grid-cols-1">
              {projects.map((project) => (
                <Link to={`/project/${project.id}/epics`}>
                  <div
                    key={project.id || `${project.name}-${project.created_at}`}
                    className="bg-white max-w-76 max-h-80 rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          {project.name}
                        </h3>
                        <Link to={`/project/${project.id}/edit`}>
                          <div className="relative group inline-block">
                            <img
                              src={dropDownIcon}
                              alt="dropdownIcon"
                              className="cursor-pointer"
                            />

                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-md">
                              Edit
                            </span>
                          </div>
                        </Link>
                      </div>

                      <p className="text-sm text-slate-600 font-bold">
                        {project.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <p className="text-xs text-slate-500 font-bold">
                        CREATED AT
                      </p>
                      <div>
                        <time className="text-xs text-slate-700 font-bold">
                          <p>{formatDate(project.created_at)}</p>
                        </time>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel (mobile only) */}
          {isMobile && currentPage < totalPages && (
            <div
              ref={loadMoreRef}
              className="h-1 sm:hidden"
              aria-hidden="true"
            />
          )}

          {loadingMore && (
            <div className="sm:hidden">
              <Skeleton count={1} />
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
                className="w-8 h-8 border border-status-todo/30 flex justify-center items-center cursor-pointer disabled:opacity-40"
              >
                <img src={arrowLeft} className="w-1 h-2 " />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 border  border-status-todo/30 flex justify-center items-center cursor-pointer transition ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 border border-status-todo/30 flex justify-center items-center cursor-pointer disabled:opacity-40"
              >
                <img src={arrowRight} className="w-1 h-2" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
