import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    // If already authenticated, go to dashboard
    api
      .get('/auth/me')
      .then(() => {
        if (mounted) navigate('/');
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/login', { username, password });
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  };

  if (loading) return null;

  return (
    <div className="login-page">
      <div className="card" style={{ maxWidth: 380, margin: '40px auto' }}>
        <h2 style={{ marginBottom: 8 }}>Sign in</h2>
        <p style={{ marginTop: 0, marginBottom: 12, opacity: 0.7 }}>
          Sign in with your username and password.
        </p>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />

          <label>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && (
            <div style={{ color: 'red', marginTop: 6 }}>{error}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
}
