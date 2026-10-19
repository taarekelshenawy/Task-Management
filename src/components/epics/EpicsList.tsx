import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from '../ui/Skelton';
import Emptystate from '../ui/Emptystate';
import { Link } from 'react-router-dom';
import DetailsModal from './DetailsModal';
import BreadCrumb from '../../shared/BreadCrumb';
import { useRef } from 'react';
import { getProjectEpics } from '../../store/epicsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import SearchEpics from './SearchEpics';
import Pagination from '../../shared/Pagination';
import dropDown from '../../assets/dropDownIcon.png';
import createIcon from '../../assets/createdIcon.png';
import dateIcon from '../../assets/dateIcon.png';
import { getInitials } from '../../utils/Helper';

export default function EpicsList() {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [epicId, setEpicId] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const dispatch = useAppDispatch();

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 639px)').matches,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const limit = 3;
  const offset = (currentPage - 1) * limit;
  const { ProjectEpics: epics, contentRange } = useAppSelector(
    (state) => state.epics,
  );

  const { projectId } = useParams();
  const totalItems = Number(contentRange?.split('/')[1] || 0);
  const totalPages = Math.ceil(totalItems / limit);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);
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

  useEffect(() => {
    console.log('searchValue:', searchValue);
  }, [searchValue]);

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

  // ===== Fetch Epics =====
  useEffect(() => {
    if (!projectId) return;
    const fetchEpics = async () => {
      const isLoadMore = isMobile && currentPage > 1;

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        await dispatch(
          getProjectEpics({
            projectId,
            limit,
            offset,
            searchValue: debouncedSearch,
          }),
        );
      } catch (err) {
        console.error(err);
        setError('Failed to load epics');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchEpics();
  }, [projectId, offset, isMobile, currentPage, dispatch, debouncedSearch]);

  // ===== Empty State =====
  if (!loading && epics.length === 0) {
    return (
      <Emptystate
        title={searchValue ? 'No epics found matching your search' : ''}
        description={
          searchValue
            ? 'Try a different search term'
            : 'You don’t have any epics yet. Start by creating your first epic.'
        }
        buttonText="+ Create New Epic"
        link={`/project/${projectId}/epics/create`}
      />
    );
  }
  const handleSearch = (value: string) => {
    setCurrentPage(1);
    setSearchValue(value);
  };

  const range = contentRange?.split('/')[0];
  if (!range) return;
  const [start, end] = range.split('-').map(Number);
  const pageItemsCount = end - start + 1;

  return (
    <div className="p-7 flex flex-col gap-5">
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
          <button className="flex items-center gap-2 bg-linear-to-br  from-[#003D9B] to-[#0052CC] cursor-pointer rounded-xs bg-primary w-45 h-11 justify-center text-white">
            + Create New Epic
          </button>
        </Link>
      </section>

      <SearchEpics setSearch={handleSearch} />

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Loading */}
      {loading ? (
        <Skeleton count={3} />
      ) : (
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {epics.map((epic) => {
            return (
              <div
                onClick={() => {
                  return (setOpenModal(true), setEpicId(epic.id));
                }}
                key={epic.id}
                className="border-l-4 border-darkGreen p-3.5 flex flex-col gap-4"
                // className="bg-white cursor-pointer rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55"
              >
                {/* TOP */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="w-17 h-6 bg-success flex justify-center items-center">
                      <p className="font-bold text-[10px] text-success-text">
                        {epic.epic_id}
                      </p>
                    </div>

                    <div>
                      <img src={dropDown} alt="dropdownIcon"></img>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-semibold text-xl">{epic.title}</h2>

                    {epic.description && (
                      <p className="text-sm text-secondary/80 mt-1">
                        {epic.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-mint-green flex justify-center items-center">
                      <p className="text-success-text font-bold">
                        {getInitials(epic.assignee.name)}
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-[12px]">Assignee</p>
                      <p className="font-semibold text-sm">
                        {epic.assignee.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <img src={createIcon} alt="created-icon"></img>

                      <p className="font-medium text-secondary/80">
                        Created by:{' '}
                        <span className="text-slate-dark">
                          {epic.created_by.name}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <img src={dateIcon} alt="date-icon"></img>

                      <p className="text-secondary/80 text-[11px] font-medium">
                        {epic.deadline}
                      </p>
                    </div>
                  </div>
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
      <Pagination
        pageItemsCount={pageItemsCount}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      {openModal && <DetailsModal epicId={epicId} modalStatus={setOpenModal} />}
    </div>
  );
}
