import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/admin';

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const result = login(form.email, form.password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(248,250,252,0.72)_42%,_rgba(241,245,249,0.96)_100%)]" />
      <div className="absolute left-[-4rem] top-[-2rem] h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="absolute bottom-[-5rem] right-[-3rem] h-64 w-64 rounded-full bg-accent-200/30 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />

      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-panel backdrop-blur-xl sm:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <div className="relative space-y-8">
          <div className="space-y-4 text-center">
            <span className="inline-flex rounded-full border border-brand-200/70 bg-brand-50/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-800">
              Acceso administrativo
            </span>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
                Centronea Automotores
              </p>
              <h1 className="font-['Fraunces'] text-3xl font-semibold text-slate-950">
                Ingresá a tu panel
              </h1>
              <p className="text-sm leading-6 text-slate-600">
                Gestioná publicaciones, stock y novedades desde una experiencia alineada con el resto del sitio.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
                placeholder="admin@centronea.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-200/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-200/50"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-200/50"
            >
              Ingresar al panel
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
