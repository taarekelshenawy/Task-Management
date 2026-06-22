import { useEffect, useState } from 'react';
import arrowRight from '../../assets/arrowRight.png';
import arrowLeft from '../../assets/arrowleft.png';
import { useParams } from 'react-router-dom';
import Skeleton from '../ui/Skelton';
import Emptystate from '../ui/Emptystate';
import { Link } from 'react-router-dom';
import DetailsModal from './DetailsModal';
import BreadCrumb from '../../shared/BreadCrumb';
import { getInitials } from '../../utils/Helper';
import { useRef } from 'react';
import { getProjectEpics } from '../../store/epicsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function EpicsList() {

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [contentRange, setContentRange] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [epicId, setEpicId] = useState('');
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 639px)').matches,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const limit = 3;
  const offset = (currentPage - 1) * limit;
   const {data:epics,contentRange}=useAppSelector((state)=>state.epics);


  const { projectId } = useParams();

  if (!projectId) {
    throw new Error('there is no project id');
  }
  const range = contentRange?.split('/')[0];
  const [start, end] = range.split('-').map(Number);
  const pageItemsCount = end - start + 1;
  const totalItems = Number(contentRange?.split('/')[1] || 0);
  const totalPages = Math.ceil(totalItems / limit);
  const dispatch = useAppDispatch();
 

  const getPagination = (current: number, total: number) => {
    const pages: (number | string)[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (current <= 3) {
      pages.push(1, 2, 3, '...', total);
      return pages;
    }

    if (current === 4) {
      pages.push(1, 2, 3, current, '...', total);
      return pages;
    }

    if (current >= total - 2) {
      pages.push(1, '...', total - 2, total - 1, total);
      return pages;
    }

    pages.push(1, '...', current - 1, current, current + 1, '...', total);

    return pages;
  };

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

  // ===== helpers =====
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  // ===== Fetch Epics =====
  useEffect(() => {
    const fetchEpics = async () => {
      const isLoadMore = isMobile && currentPage > 1;

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        await dispatch(getProjectEpics({ projectId, limit, offset }));
   
      
      } catch (err) {
        console.error(err);
        setError('Failed to load epics');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchEpics();
  }, [projectId, offset, isMobile, currentPage,dispatch]);

  // ===== Empty State =====
  if (!loading && epics.length === 0) {
    return (
      <Emptystate
        title="No Epics"
        description="You don’t have any epics yet. Start by creating your first epic."
        buttonText="+ Create New Epic"
        link={`/project/${projectId}/epics/create`}
      />
    );
  }

  return (
    <div className="p-7 flex flex-col gap-12">
      <BreadCrumb
        items={[
          { label: 'PROJECTS', href: '/project' },
          { label: 'PROJECT Name', href: '/project' },
          { label: 'Epics' },
        ]}
      />

      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <div>
          <h1 className="text-4xl font-semibold text-slate-dark">
            Project Epics
          </h1>
          <p className="font-medium text-secondary">
            Manage and curate your epics
          </p>
        </div>

        <Link to={`/project/${projectId}/epics/create`}>
          <button className="flex items-center gap-2 cursor-pointer bg-primary w-45 h-11 justify-center text-white">
            + Create New Epic
          </button>
        </Link>
      </section>

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Loading */}
      {loading ? (
        <Skeleton count={3} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-sm:grid-cols-1">
          {epics.map((epic) => {
            return (
              <div
                onClick={() => {
                  return (setOpenModal(true), setEpicId(epic.id));
                }}
                key={epic.id}
                className="bg-white cursor-pointer rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55"
              >
                {/* TOP */}
                <div className="flex flex-col gap-4">
                  <div className="text-xs text-gray-500 font-bold bg-success p-1 w-fit px-2 rounded">
                    {epic.epic_id}
                  </div>

                  <p className="text-sm text-slate-600 font-bold">
                    {epic.description || 'No description'}
                  </p>

                  {/* Assignee */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#65DCA4] text-white text-xs flex items-center justify-center rounded-md font-bold">
                        {getInitials(epic.assignee?.name)}
                      </div>

                      <span>{epic.assignee?.name}</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="pt-4 flex justify-between">
                  <p className="text-xs text-slate-500">Created at</p>

                  <time className="text-sm font-medium text-slate-700">
                    {formatDate(epic.created_at)}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite scroll sentinel (mobile only) */}
      {isMobile && currentPage < totalPages && (
        <div ref={loadMoreRef} className="h-1 sm:hidden" aria-hidden="true" />
      )}

      {loadingMore && (
        <div className="sm:hidden">
          <Skeleton count={1} />
        </div>
      )}

      {/* Pagination UI only */}
      <div className="flex justify-between bg-white p-4 items-center ">
        <p className="font-bold text-secondary">
          Showing {pageItemsCount} of {totalItems} active projects
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 border flex items-center justify-center"
          >
            <img src={arrowLeft} className="w-1 h-2" />
          </button>

          {getPagination(currentPage, totalPages).map((page, index) => (
            <button
              key={index}
              disabled={page === '...'}
              onClick={() => {
                if (typeof page === 'number') {
                  setCurrentPage(page);
                }
              }}
              className={`w-8 h-8 border flex items-center justify-center ${
                currentPage === page ? 'bg-blue-800 text-white' : ''
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={Number(currentPage) === Number(totalPages)}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="w-8 h-8 border flex items-center justify-center"
          >
            <img src={arrowRight} className="w-1 h-2" />
          </button>
        </div>
      </div>

      {openModal && <DetailsModal epicId={epicId} modalStatus={setOpenModal} />}
    </div>
  );
}
