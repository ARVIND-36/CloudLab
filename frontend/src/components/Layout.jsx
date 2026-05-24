import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
  ].join(' ');

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-ink-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-teal-500 text-sm font-black text-slate-950 shadow-lg shadow-gold-500/20">
              CL
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">CloudLab</p>
              <h1 className="text-lg font-semibold text-white">Student cloud labs on AKS</h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Signed in as</p>
              <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
            </div>
            <button type="button" className="secondary-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}