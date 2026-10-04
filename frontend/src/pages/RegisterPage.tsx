import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Sprout, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterForm) {
    setLoading(true);
    setServerError('');
    try {
      await signUp(data.email, data.password);
      setSuccess(true);
      // After 2s, redirect to dashboard (session is set by Supabase automatically)
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md w-full text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account created!</h2>
          <p className="text-slate-400 text-sm">Redirecting you to your dashboard…</p>
          <div className="mt-6 w-8 h-8 border-2 border-emerald-900 border-t-emerald-400 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-700/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-glow-sm">
              <Sprout size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Crop<span className="text-emerald-400">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm">Start getting AI-powered crop advisories today</p>
        </div>

        <div className="glass-card p-8">
          {serverError && (
            <div className="alert-danger mb-6">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="register-email" className="form-label">Email address</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@farm.com"
                {...register('email')}
                className="form-input"
              />
              {errors.email && <p className="form-error"><AlertCircle size={12} />{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  {...register('password')}
                  className="form-input pr-12"
                />
                <button
                  type="button"
                  id="register-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="form-error"><AlertCircle size={12} />{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm-password" className="form-label">Confirm password</label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  {...register('confirmPassword')}
                  className="form-input pr-12"
                />
                <button
                  type="button"
                  id="register-toggle-confirm"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="form-error"><AlertCircle size={12} />{errors.confirmPassword.message}</p>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <UserPlus size={18} />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" id="register-login-link" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
