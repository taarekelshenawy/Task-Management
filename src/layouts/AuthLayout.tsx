import { Outlet } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';

export default function AuthLayout() {
  return (
    <div className="min-h-screen pb-14">
      <AuthHeader />
      <Outlet />
    </div>
  );
}
