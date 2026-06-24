import arrowRight from '../assets/arrowRight.png';
import arrowLeft from '../assets/arrowleft.png';
import getPagination from './GetPaginationFun';

type PaginationProps = {
  pageItemsCount: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Pagination({
  pageItemsCount,
  totalItems,
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex justify-between bg-white p-4 items-center">
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
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="w-8 h-8 border flex items-center justify-center"
        >
          <img src={arrowRight} className="w-1 h-2" />
        </button>
      </div>
    </div>
  );
}
