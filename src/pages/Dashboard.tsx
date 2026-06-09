import { useEffect } from 'react';
import Sidebar from '../Componenets/Sidebar/leftSidebar';
import { useAppDispatch } from '../Store/hooks';
import { getUser } from '../Store/UserSlice';
import { useAppSelector } from '../Store/hooks';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.User);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const name = user?.user_metadata?.name ?? '';

  const userName = name
    ? `${name.split(' ')[0]?.slice(0, 1)?.toUpperCase() ?? ''}
     ${name.split(' ')[1]?.slice(0, 1)?.toUpperCase() ?? ''}`
    : '';

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        {loading ? (
          <div className="p-4">...loading </div>
        ) : (
          <div className="flex justify-end p-3">
            <div className="flex items-center gap-2 ">
              <div>
                <h2 className="font-bold">{user?.user_metadata.name}</h2>
                <p className="font-bold text-[#003D9B]">
                  {user?.user_metadata.department}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0052CC] flex justify-center items-center text-white">
                <p>{user ? userName : ''}</p>
              </div>
            </div>
          </div>
        )}

        {/* add project */}
        <Outlet />
      </div>
    </div>
  );
}
