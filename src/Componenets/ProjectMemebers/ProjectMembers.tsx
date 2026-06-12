import arrowIcon from '../../assets/arrowIcon.png';
import inviteIcon from '../../assets/InviteIcon.png';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { getProjectMembers } from '../../Store/ProjectSlice';
import { Link } from 'react-router-dom';
import MemberSkeleton from './MemberSkelton';

export default function ProjectMembers() {
  const { members,loading } = useAppSelector((state) => state.Project);
  const dispatch = useAppDispatch();
  const { projectId } = useParams();

  if (!projectId) {
    throw new Error('there is no project Id');
  }

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const result = await dispatch(getProjectMembers({ projectId }));

        if (getProjectMembers.fulfilled.match(result)) {
          toast.success('Members loaded successfully');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };

    fetchProjectMembers();
  }, [projectId, dispatch]);

  // ✅ helper function
  const getInitials = (name: string = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');

  return (
    <div className="w-full p-7">
      <header className="flex items-center gap-2 max-sm:hidden">
        <Link to="/project">
          <p className="font-bold text-secondary">PROJECTS</p>
        </Link>
      
        <img src={arrowIcon} className="w-2" />
        <p className="font-bold text-primary">Members</p>
      </header>

      <section className="max-sm:hidden flex justify-between items-center mt-7">
        <h1 className="text-4xl font-semibold text-slate-dark">
          Project Members
        </h1>

        <button className="flex items-center gap-2 bg-primary w-45 h-11 justify-center text-white">
          <img src={inviteIcon} />
          <span className="font-bold">Invite Member</span>
        </button>
      </section>

      <table className="mt-16 w-full max-w-197.25 bg-slate-lighter/30 border rounded-lg overflow-hidden mx-auto">
        <thead className="text-left">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-600">MEMBER</th>
            <th className="p-4 text-sm font-semibold text-gray-600">ROLE</th>
            <th className="p-4 text-sm font-semibold text-gray-600">ACTIONS</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {loading ?   Array.from({ length: members.length }).map((_, i) => (
        <MemberSkeleton key={i} />
      )):
      <>
      {members?.map((el) => {
            const name = el?.metadata?.name ?? '';
            const initials = getInitials(name);

            return (
              <tr
                key={el?.member_id || el?.user_id}
                className="hover:bg-gray-50 transition"
              >
                {/* MEMBER */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* avatar */}
                    <div className="w-12 h-12 rounded-xl bg-[#0052CC] flex items-center justify-center text-white font-bold">
                      {initials}
                    </div>

                    {/* info */}
                    <div className="flex flex-col">
                      <h2 className="font-semibold text-gray-900">
                        {name}
                      </h2>
                      <p className="text-sm text-gray-500">{el.email}</p>
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-4 align-middle">
                  <span className="bg-primary w-17 h-5 p-1 rounded-2xl px-7 text-white">
                    {el.role}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 align-middle">
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
      </>
    
    }
          
        </tbody>
      </table>
    </div>
  );
}



