import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await register({ name, email, password });
      navigate('/dashboard', { replace: true });
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
        <h2 className="mt-4 text-3xl font-semibold text-white">Create your student account</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Register once, then launch labs on demand with JWT-secured access.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="field-label">Name</span>
            <input className="input-shell" type="text" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
          </label>

          <label className="block">
            <span className="field-label">Email</span>
            <input className="input-shell" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label className="block">
            <span className="field-label">Password</span>
            <input className="input-shell" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </label>

          {message ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{message}</p> : null}

          <button type="submit" className="primary-button w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-gold-400 hover:text-gold-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}