import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api.get('/auth/me')
      .then(res => {
        if (mounted) setUser(res.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setOpen(false);
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return null;

  if (!user)
    return (
      <div className="profile">
        <div className="avatar">?</div>
        <div className="profile-name">Guest</div>
      </div>
    );

  const initials = user.name
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="profile" ref={ref}>
      <button
        className="profile-btn"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="avatar">{initials}</div>
        <div className="profile-name">{user.name}</div>
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-item" aria-hidden>
            Signed in as
            <div style={{ fontWeight: 700, marginTop: 6 }}>{user.name}</div>
          </div>
          <div className="divider" />
          <button className="profile-dropdown-item" role="menuitem" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
