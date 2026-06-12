import arrowIcon from '../../assets/arrowIcon.png';
import inviteIcon from '../../assets/InviteIcon.png';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../Store/hooks';
import { useAppSelector } from '../../Store/hooks';
import { getProjectMembers } from '../../Store/ProjectSlice';
export default function ProjectMembers() {
  const { members } = useAppSelector((state) => state.Project);
  const dispatch = useAppDispatch();
  // const [members, setMemebers] = useState([
  //   { metadata: { name: '' }, email: '', role: '' },
  // ]);
  const { projectId } = useParams();
  if (!projectId) {
    throw new Error('there no project Id');
  }

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const result = await dispatch(getProjectMembers({ projectId }));
        if (getProjectMembers.fulfilled.match(result)) {
          toast('success');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchProjectMembers();
  }, [projectId, dispatch]);

  const name = members?.[0]?.metadata?.name ?? '';

  const userName = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <div className="w-full p-7">
      <header className="flex items-center gap-2 max-sm:hidden">
        <p className="font-bold text-secondary">PROJECTS</p>
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

      <table className=" mt-16 w-full max-w-197.25 bg-slate-lighter/30 border rounded-lg overflow-hidden mx-auto">
        {/* header */}
        <thead className="text-left">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-600">MEMBER</th>
            <th className="p-4 text-sm font-semibold text-gray-600">ROLE</th>
            <th className="p-4 text-sm font-semibold text-gray-600">ACTIONS</th>
          </tr>
        </thead>

        {/* body */}
        <tbody className="bg-white ">
          {members.map((el) => {
            return (
              <tr className=" hover:bg-gray-50 transition">
                {/* MEMBER */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* avatar */}
                    <div className="w-12 h-12 rounded-xl bg-[#0052CC] flex items-center justify-center text-white font-bold">
                      {members ? userName : ''}
                    </div>

                    {/* info */}
                    <div className="flex flex-col">
                      <h2 className="font-semibold text-gray-900">
                        {userName}
                      </h2>
                      <p className="text-sm text-gray-500">{el.email}</p>
                    </div>
                  </div>
                </td>

                {/* ROLE column (لو عايز تفصله بدل ما يكون تحت الاسم) */}
                <td className="p-4 align-middle">
                  <span className="bg-primary w-17 h-5 p-1 rounded-2xl px-7 text-white">
                    {members[0]?.role}
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
        </tbody>
      </table>
    </div>
  );
}
