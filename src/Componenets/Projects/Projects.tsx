import { useEffect, useMemo, useState } from 'react';
import { GetProjects } from '../../services/projectService';
import EmptyIcon from '../../assets/EmptyIcon.png';
import arrowRight from '../../assets/arrowRight.png';
import arrowLeft from '../../assets/arrowleft.png';
import { Link } from 'react-router-dom';

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
  const [error, setError] = useState('');

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

  // ===== Fetch Projects =====
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await GetProjects({ limit, offset });

        const data = await response.json();

        const contentRangeHeader = response.headers.get('Content-Range') || '';

        setContentRange(contentRangeHeader);
        setProjects(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [offset]);

  // ===== Prevent invalid page =====
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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

    // لو قربنا من النهاية نرجع النافذة لورا
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
          <Link to="add">  <span className="font-bold">+ Create New Project</span></Link>
        
        </button>
      </section>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading projects...</p>
      )}

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Projects Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-sm:grid-cols-1">
        {projects.map((project) => (
          <Link to={`/project/${project.id}/epics`}>
            <div
              key={project.id || `${project.name}-${project.created_at}`}
              className="bg-white max-w-76 rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55"
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
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between bg-white p-4 items-center">
        <p className="font-bold text-secondary">
          Showing {displayedCount} of {total} active projects
        </p>

        <div className="flex items-center gap-2">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer disabled:opacity-40"
          >
            <img src={arrowLeft} className="w-1 h-2" />
          </button>

          {/* Pages */}
          {/* {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer ${
                currentPage === index + 1
                  ? 'bg-primary text-white'
                  : 'text-black'
              }`}
            >
              {index + 1}
            </button>
          ))} */}
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

// import { useEffect, useState } from 'react';
// import { GetProjects } from '../../services/projectService';
// import EmptyIcon from '../../assets/EmptyIcon.png';
// import arrowRight from '../../assets/arrowRight.png';
// import arrowLeft from '../../assets/arrowleft.png';

// type Project = {
//   name: string;
//   description: string;
//   created_at: string;
// };

// export default function Projects() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [currentPage,setCurrentPage]=useState(1);
//   const [contentRange,setContentRange]=useState('')
//   const limit = 3;
//   const offset = (currentPage - 1) * limit;

//   const [range, total] = contentRange ? contentRange.split('/') : ['', '0'];
// const [start, end] = range ? range.split('-').map(Number) : [0, 0];

// const displayedCount = end - start + 1;

// const totalPages =Math.ceil(Number(total)/limit);
// console.log(totalPages)

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await GetProjects({limit,offset});

//         const data = await response.json();
//       setContentRange(response.headers.get('Content-Range'))

//         setProjects(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchProjects();
//   }, [offset]);

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   return (
//     <>
//       {projects.length === 0 ? (
//         <div className="flex flex-col  justify-center items-center gap-5">
//           <div className="max-w-75 text-center flex flex-col gap-5">
//             <img src={EmptyIcon} className="max-w-[288px]"></img>
//             <h1 className="font-bold text-2xl">No Projects</h1>
//             <p>
//               You don’t have any projects yet. Start by defining your first
//               architectural workspace to begin tracking tasks and epics.
//             </p>
//             <div className="flex justify-center">
//               <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
//                 <span className="font-bold">+ Create New Project</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="p-7 flex flex-col gap-12">
//           <section className="max-sm:hidden flex justify-between items-center mt-7">
//             <div>
//               <h1 className="text-4xl font-semibold text-slate-dark">
//                 Projects
//               </h1>
//               <p className="font-medium text-secondary">
//                 Manage and curate your projects
//               </p>
//             </div>

//             <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
//               <span className="font-bold">+ Create New Project</span>
//             </button>
//           </section>
//           <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-sm:grid-cols-1">
//             {projects.map((project) => (
//               <div
//                 key={`${project.name}-${project.created_at}`}
//                 className="bg-white max-w-76 rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-[220px]"
//               >
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                     {project.name}
//                   </h3>

//                   <p className="text-sm text-slate-600 font-bold">
//                     {project.description || 'No description provided'}
//                   </p>
//                 </div>

//                 <div className="pt-4 flex justify-between">
//                   <p className="text-xs text-slate-500">Created at</p>

//                   <time className="text-sm font-medium text-slate-700">
//                     {formatDate(project.created_at)}
//                   </time>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className='flex justify-between bg-white p-4 items-center'>
//             <p className='font-bold text-secondary'>Showing {displayedCount} of {total} active projects</p>
//             <div className='flex items-center gap-2'>
//               <button onClick={()=>setCurrentPage(currentPage-1)} disabled={currentPage===1}
//               className=' w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer '>
//                 <img src={arrowLeft} className='w-1 h-2'></img>
//               </button>
//               {Array.from({ length: totalPages }, (_, index) => (
//                               <button key={index} className={`${currentPage===(index+1) ? 'bg-primary text-white ' :'text-black'}  w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer `} onClick={()=>setCurrentPage(index+1)}>
//                                 {index + 1}
//                               </button>
//               ))}

//               <button onClick={()=>setCurrentPage(currentPage+1)} disabled={currentPage===totalPages}  className='w-8 h-8 border border-slate-light flex justify-center items-center cursor-pointer '>
//                 <img src={arrowRight}  className='w-1 h-2'></img>
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </>
//   );
// }
