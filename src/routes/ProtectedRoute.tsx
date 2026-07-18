import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/cookies';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  if (!token) return;

  return <div>{children}</div>;
}
