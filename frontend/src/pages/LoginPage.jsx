import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const destination = location.state?.from?.pathname ?? '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await login({ email, password });
      navigate(destination, { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-md rounded-[2rem] p-8">
        <p className="field-label">CloudLab</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Sign in to your lab console</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Use your student account to create isolated Docker or Terraform labs on AKS.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="field-label">Email</span>
            <input className="input-shell" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label className="block">
            <span className="field-label">Password</span>
            <input className="input-shell" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {message ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{message}</p> : null}

          <button type="submit" className="primary-button w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-gold-400 hover:text-gold-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}