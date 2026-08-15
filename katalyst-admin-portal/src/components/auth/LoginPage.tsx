import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  KeyRound, 
  Users, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  WifiOff
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { INITIAL_ADMIN_USERS } from '../../data/mockData';

export const LoginPage: React.FC = () => {
  const { login } = useAdmin();
  
  const [email, setEmail] = useState('admin@katalystindia.org');
  const [password, setPassword] = useState('KatalystAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginState, setLoginState] = useState<'default' | 'loading' | 'invalid' | 'locked' | 'network_error' | 'session_expired'>('default');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginState === 'invalid') {
      return;
    }
    if (loginState === 'locked') {
      return;
    }
    if (loginState === 'network_error') {
      return;
    }

    setLoginState('loading');
    setTimeout(() => {
      login(email);
    }, 900);
  };

  const handleSelectDemoUser = (userEmail: string, role: string) => {
    setEmail(userEmail);
    setPassword('Katalyst@2026');
    setLoginState('default');
    login(userEmail, role);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-700 shadow-xl shadow-rose-950/60 ring-4 ring-rose-500/20 mb-4">
            <span className="text-3xl font-black text-white font-mono tracking-tighter">K</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            KATALYST INDIA
          </h2>
          <p className="mt-1 text-sm text-slate-400 font-medium">
            Student Outreach & Application Tracking System
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Welcome back</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your authorized administrative credentials to continue.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-400 block font-mono">DEFAULT ADMIN ACCESS</span>
                <span className="text-slate-200">Email: <code className="text-rose-300">admin@katalystindia.org</code></span>
                <span className="mx-2 text-slate-600">|</span>
                <span className="text-slate-200">Password: <code className="text-rose-300">KatalystAdmin2026!</code></span>
              </div>
            </div>
          </div>

          {/* Login Error / State Banners */}
          {loginState === 'invalid' && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-300">Invalid Credentials</div>
                <div className="text-rose-200/90 mt-0.5">
                  The email or password does not match Katalyst directory records. Please check and try again.
                </div>
              </div>
            </div>
          )}

          {loginState === 'locked' && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-300">Account Temporarily Locked</div>
                <div className="text-amber-200/90 mt-0.5">
                  Exceeded 5 unsuccessful login attempts. For security, access is locked for 15 minutes or contact your Super Admin.
                </div>
              </div>
            </div>
          )}

          {loginState === 'session_expired' && (
            <div className="mb-5 p-3.5 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-200 text-xs flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-300">Session Expired</div>
                <div className="text-blue-200/90 mt-0.5">
                  Your previous security session timed out. Please sign in again to resume administrative operations.
                </div>
              </div>
            </div>
          )}

          {loginState === 'network_error' && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-300">Network Error</div>
                <div className="text-rose-200/90 mt-0.5">
                  Unable to reach authentication gateway. Check your internet connection or try again.
                </div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1">
                Katalyst Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="admin@katalystindia.org"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setForgotEmail(email);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                  Remember this device for 30 days
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginState === 'loading'}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-rose-950/50 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-60 transition-all cursor-pointer"
              >
                {loginState === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Persona Switcher for Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-rose-400" />
                <span>Instant Demo Login (One-Click)</span>
              </span>
              <span className="text-[10px] text-slate-500">Select role:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_ADMIN_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(user.email, user.role)}
                  className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
                >
                  <div className="text-xs font-semibold text-white group-hover:text-rose-300 truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-rose-400 font-mono font-medium">
                    {user.role}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* State Switcher for UI Verification */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Test UI States:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setLoginState('default')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${loginState === 'default' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setLoginState('invalid')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${loginState === 'invalid' ? 'bg-rose-900 text-rose-200 font-bold' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Invalid
              </button>
              <button
                type="button"
                onClick={() => setLoginState('locked')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${loginState === 'locked' ? 'bg-amber-900 text-amber-200 font-bold' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Locked
              </button>
              <button
                type="button"
                onClick={() => setLoginState('session_expired')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${loginState === 'session_expired' ? 'bg-blue-900 text-blue-200 font-bold' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Expired
              </button>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit SSL encrypted administrative gateway</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Reset Admin Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered @katalystindia.org address. A secure time-limited reset link will be dispatched.
            </p>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="font-semibold">Reset Link Dispatched</div>
                <p className="text-emerald-300/80">Check your inbox at {forgotEmail} to set a new password.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@katalystindia.org"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    Send Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
