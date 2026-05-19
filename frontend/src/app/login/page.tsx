'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/src/application/services/AuthService';
import { useAuthStore } from '@/src/application/state/AuthStore';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return 0;
    if (len < 6) return 1;
    if (len < 10) return 2;
    return 3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        await AuthService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        const res = await AuthService.login({ email: formData.email, password: formData.password });
        setAuth(res.user, res.token);
        router.push('/main/dashboard');
      } else {
        const res = await AuthService.login({ email: formData.email, password: formData.password });
        setAuth(res.user, res.token);
        router.push('/main/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Verifica tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <main className="min-h-screen flex flex-col justify-center items-center relative p-6">
      {/* Registration / Login Container */}
      <div className="w-full max-w-[500px] z-10 flex flex-col items-center animate-fade-in-up">
        {/* Brand Identity */}
        <div className="mb-12 text-center">
          {!isRegister && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high border border-white/10 mb-4 shadow-lg">
              <span className="material-symbols-outlined text-secondary text-4xl">casino</span>
            </div>
          )}
          <h1 className="font-display-md bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-1">
            ¿Y si sí?
          </h1>
          <p className="font-label-caps text-on-surface-variant tracking-widest">LOTTERY TRACKER PREMIUM</p>
        </div>

        {/* Form Card */}
        <div className="glass-container inner-glow w-full rounded-xl p-8 md:p-10 neon-glow-primary transition-all duration-500 relative overflow-hidden">
          {/* Top edge accent */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <header className="mb-8">
            <h2 className="font-headline-lg text-on-surface mb-1">
              {isRegister ? 'Crear Cuenta' : 'Log In'}
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-container to-secondary mt-2 rounded-full"></div>
            {isRegister && (
              <p className="font-body-sm text-on-surface-variant mt-3">Únete a la élite y empieza a ganar hoy mismo.</p>
            )}
          </header>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/50 text-error font-body-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name Field (Register only) */}
            {isRegister && (
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-on-surface-variant ml-1" htmlFor="name">Nombre Completo</label>
                <div className="relative flex items-center group">
                  <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border border-white/5 rounded-xl py-4 pl-12 pr-4 font-body-lg text-on-surface focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-on-surface-variant ml-1" htmlFor="email">
                {isRegister ? 'Correo Electrónico' : 'Email Address'}
              </label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="usuario@lottoelite.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-lowest border border-white/5 rounded-xl py-4 pl-12 pr-4 font-body-lg text-on-surface focus:ring-1 focus:ring-primary transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-label-caps text-on-surface-variant" htmlFor="password">
                  {isRegister ? 'Contraseña' : 'Password'}
                </label>
                {!isRegister && (
                  <a className="font-label-caps text-secondary hover:text-secondary-fixed transition-colors cursor-pointer" href="#">Forgot Password?</a>
                )}
              </div>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full bg-surface-container-lowest border border-white/5 rounded-xl py-4 pl-12 pr-12 font-body-lg text-on-surface focus:ring-1 focus:ring-primary transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {/* Password strength indicator (Register only) */}
              {isRegister && (
                <div className="flex gap-1 mt-1 px-1">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 1 ? (strength === 1 ? 'bg-primary-container' : strength === 2 ? 'bg-secondary' : 'bg-tertiary-container') : 'bg-white/10'}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 2 ? (strength === 2 ? 'bg-secondary' : 'bg-tertiary-container') : 'bg-white/10'}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-tertiary-container' : 'bg-white/10'}`}></div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-title-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  <span>{isRegister ? 'Crear Mi Cuenta' : 'Log In'}</span>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="font-body-sm text-on-surface-variant">
              {isRegister ? '¿Ya tienes una cuenta?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(null); }}
                className="text-primary font-bold hover:underline ml-2"
              >
                {isRegister ? 'Inicia Sesión' : 'Register'}
              </button>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-12 flex items-center gap-2 text-on-surface-variant opacity-60">
          <span className="material-symbols-outlined text-[18px]">security</span>
          <span className="font-label-caps">Encriptación Grado Militar SSL</span>
        </div>
      </div>

      {/* Floating decorative elements (desktop only) */}
      <div className="hidden lg:block absolute left-[15%] top-[25%] opacity-20 animate-float pointer-events-none">
        <div className="w-32 h-32 glass-panel rounded-3xl rotate-12 flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-secondary">confirmation_number</span>
        </div>
      </div>
      <div className="hidden lg:block absolute right-[12%] bottom-[20%] opacity-20 animate-float pointer-events-none" style={{ animationDelay: '-2s' }}>
        <div className="w-24 h-24 glass-panel rounded-full -rotate-12 flex items-center justify-center">
          <span className="material-symbols-outlined text-[40px] text-primary">currency_exchange</span>
        </div>
      </div>
    </main>
  );
}
