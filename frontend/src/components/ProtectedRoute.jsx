import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get('/auth/me')
      .then(() => {
        if (mounted) setAuthed(true);
      })
      .catch(() => {
        if (mounted) setAuthed(false);
      })
      .finally(() => mounted && setChecking(false));
    return () => (mounted = false);
  }, []);

  if (checking) return null;
  return authed ? <Outlet /> : <Navigate to="/login" replace />;
}
