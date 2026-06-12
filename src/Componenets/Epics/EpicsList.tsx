import { useEffect, useState } from 'react';
import arrowRight from '../../assets/arrowRight.png';
import arrowLeft from '../../assets/arrowleft.png';
import { useParams } from 'react-router-dom';
import { getProjectEpics } from '../../services/epicsService';
import Skeleton from '../ui/Skelton';
import Emptystate from '../ui/Emptystate';
import arrowIcon from '../../assets/arrowIcon.png';
import { Link } from 'react-router-dom';

type Epic = {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline?: string;
  created_at: string;
  created_by: {
    name: string;
  };
  assignee: {
    name: string;
    email?: string;
  };
};

export default function EpicsList() {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { projectId } = useParams();

  if (!projectId) {
    throw new Error('there is no project id');
  }

  // ===== helpers =====
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const getInitials = (name: string = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');

  // ===== Fetch Epics =====
  useEffect(() => {
    const fetchEpics = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getProjectEpics(projectId);
        setEpics(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load epics');
      } finally {
        setLoading(false);
      }
    };

    fetchEpics();
  }, [projectId]);

  // ===== Empty State =====
  if (!loading && epics.length === 0) {
    return (
      <Emptystate
        title="No Epics"
        description="You don’t have any epics yet. Start by creating your first epic."
        buttonText="+ Create New Epic"
        link={`/project/${projectId}/epics/new`}
      />
    );
  }

  return (
    <div className="p-7 flex flex-col gap-12">

       <header className="flex items-center gap-2 max-sm:hidden">
        <Link
          to="/project"
          className="font-bold text-secondary hover:underline"
        >
          PROJECTS
        </Link>
        <img src={arrowIcon} className="w-2" />
        <p className="font-bold text-primary">Epics</p>
      </header>



      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <div>
          <h1 className="text-4xl font-semibold text-slate-dark">
            Project Epics
          </h1>
          <p className="font-medium text-secondary">
            Manage and curate your epics
          </p>
        </div>

        <Link to="/project/epics">
         <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
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
            const name = epic.assignee?.name ?? '';
            const initials = getInitials(name);

            return (
              <div
                key={epic.id}
                className="bg-white rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55"
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
                        {initials}
                      </div>

                      <span>{name}</span>
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

      {/* Pagination UI only */}
      <div className="flex justify-between bg-white p-4 items-center opacity-60">
        <p className="font-bold text-secondary">
          Pagination UI only (not functional)
        </p>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 border flex items-center justify-center">
            <img src={arrowLeft} className="w-1 h-2" />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className="w-8 h-8 border flex items-center justify-center"
            >
              {page}
            </button>
          ))}

          <button className="w-8 h-8 border flex items-center justify-center">
            <img src={arrowRight} className="w-1 h-2" />
          </button>
        </div>
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import arrowRight from '../../assets/arrowRight.png';
// import arrowLeft from '../../assets/arrowleft.png';
// import { useParams } from 'react-router-dom';
// import { getProjectEpics } from '../../services/epicsService';
// import Skeleton from '../ui/Skelton';
// import Emptystate from '../ui/Emptystate';

// type Epic = {
//   id: string;
//   epic_id: string;
//   title: string;
//   description?: string;
//   deadline?: string;
//   created_at: string;
//   created_by: {
//     name: string;
//   };
//   assignee: {
//     name: string;
//     email?: string;
//   };
// };

// export default function EpicsList() {
//   const [epics, setEpics] = useState<Epic[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { projectId } = useParams();

//   if (!projectId) {
//     throw new Error('there is no project id');
//   }

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString('en-GB', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   // ===== Fetch Epics =====
//   useEffect(() => {
//     const fetchEpics = async () => {
//       setLoading(true);
//       setError('');

//       try {
//         const data = await getProjectEpics(projectId);

//         setEpics(data || []);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load epics');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEpics();
//   }, [projectId]);
//   console.log(epics);
//   // ===== Empty State =====
//   if (!loading && epics.length === 0) {
//     return <Emptystate title="No Epics"
//     link='/epics' 
//     buttonText='+ Create New Epic'
//     description='You don’t have any epics yet. Start by creating your first epic.'/>
   
//   }

//   return (
//     <div className="p-7 flex flex-col gap-12">
//       {/* Header */}
//       <section className="max-sm:hidden flex justify-between items-center mt-7">
//         <div>
//           <h1 className="text-4xl font-semibold text-slate-dark">
//             Project Epics
//           </h1>
//           <p className="font-medium text-secondary">
//             Manage and curate your epics
//           </p>
//         </div>

//         <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
//           + Create New Epic
//         </button>
//       </section>


//       {/* Error */}
//       {error && <p className="text-center text-red-500">{error}</p>}

//       {/* Epics Grid */}
//       {loading ? <Skeleton count={epics.length}/>
//       :
//        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-sm:grid-cols-1">
//         {epics.map((epic) => (
//           <div
//             key={epic.id}
//             className="bg-white rounded-lg p-6 flex flex-col justify-between shadow-sm min-h-55 "
//           >
//             {/* Top */}
//             <div  className='flex flex-col gap-4'>
//               <div className="text-xs text-gray-500 font-bold bg-success p-1 w-17">{epic.epic_id}</div>
//               <p className="text-sm text-slate-600 font-bold">
//                 {epic.description || 'No description'}
//               </p>

//               {/* Assignee */}
//               <div className="mt-3 text-sm">
//                 <span className="font-bold">Assignee:</span>{' '}
//                 {epic.assignee?.name}
//               </div>

           
//             </div>

//             {/* Bottom */}
//             <div className="pt-4 flex justify-between">
//               <p className="text-xs text-slate-500">Created at</p>

//               <time className="text-sm font-medium text-slate-700">
//                 {formatDate(epic.created_at)}
//               </time>
//             </div>
//           </div>
//         ))}
//       </div>
//       }
     

//       {/* Pagination UI only */}
//       <div className="flex justify-between bg-white p-4 items-center opacity-60">
//         <p className="font-bold text-secondary">
//           Pagination UI only (not functional)
//         </p>

//         <div className="flex items-center gap-2">
//           <button className="w-8 h-8 border flex items-center justify-center">
//             <img src={arrowLeft} className="w-1 h-2" />
//           </button>

//           {[1, 2, 3].map((page) => (
//             <button
//               key={page}
//               className="w-8 h-8 border flex items-center justify-center"
//             >
//               {page}
//             </button>
//           ))}

//           <button className="w-8 h-8 border flex items-center justify-center">
//             <img src={arrowRight} className="w-1 h-2" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


