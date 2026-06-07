import { useEffect } from 'react';
import { useAppSelector } from '../../Store/hooks';
import { useNavigate } from 'react-router-dom';

export default function Guard({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((state) => state.Auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  if (!token) return;

  return <div>{children}</div>;
}
