import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSociety } from '../../context/SocietyContext';
import { api } from '../../services/api';
import {
  Building2,
  Shield,
  CheckCircle2,
  ArrowRight,
  Home,
  Lock,
  Mail,
  User as UserIcon,
  Loader2,
  UserPlus,
  LogIn,
  Crown,
  Smartphone,
  KeyRound,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, showToast } = useSociety();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign In Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Register Form State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<'ROLE_RESIDENT' | 'ROLE_ADMIN'>('ROLE_RESIDENT');
  const [regFlat, setRegFlat] = useState<string>('B-201');

  // Forgot Password / OTP Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [forgotIdentifier, setForgotIdentifier] = useState<string>('+91 98250 11223');
  const [forgotOtp, setForgotOtp] = useState<string>('');
  const [forgotNewPassword, setForgotNewPassword] = useState<string>('');
  const [isForgotOtpSent, setIsForgotOtpSent] = useState<boolean>(false);
  const [isSendingForgotOtp, setIsSendingForgotOtp] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [forgotMessage, setForgotMessage] = useState<string>('');
  const [forgotError, setForgotError] = useState<string>('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const authData = await api.login(email, password);
      let userRole: UserRole = 'admin';
      if (authData.role === 'ROLE_SUPER_ADMIN') userRole = 'super_admin';
      else if (authData.role === 'ROLE_RESIDENT') userRole = 'resident';
      
      setRole(userRole);
      showToast(
        'success',
        `Logged in as ${authData.name}`,
        `Welcome to ${authData.societyName || 'Society Management'} (${userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin' ? 'Admin' : 'Resident'} Portal)`
      );

      if (userRole === 'super_admin') {
        navigate('/super-admin');
      } else if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/resident');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      showToast('error', 'Login Failed', err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const authData = await api.register(regName, regEmail, regPassword, regRole, regRole === 'ROLE_RESIDENT' ? regFlat : undefined);
      const userRole: UserRole = authData.role === 'ROLE_ADMIN' ? 'admin' : 'resident';
      setRole(userRole);
      showToast('success', 'Account Registered!', `Welcome ${authData.name} to the Society Management System`);
      navigate(userRole === 'admin' ? '/admin' : '/resident');
    } catch (err: any) {
      console.error('Registration failed:', err);
      showToast('error', 'Registration Failed', err.message || 'Could not create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Reset Password Handlers
  const handleSendForgotOtp = async () => {
    if (!forgotIdentifier || forgotIdentifier.length < 5) {
      setForgotError('Please enter your registered mobile number or email.');
      return;
    }
    setForgotError('');
    setIsSendingForgotOtp(true);
    try {
      const res = await api.sendOtp(forgotIdentifier, 'PASSWORD_RESET');
      setIsForgotOtpSent(true);
      if (res.otp) setForgotOtp(res.otp); // dev convenience auto-fill
      setForgotMessage(`6-digit OTP sent to ${forgotIdentifier}. (Code: ${res.otp || 'Check SMS'})`);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to dispatch OTP.');
    } finally {
      setIsSendingForgotOtp(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length < 4) {
      setForgotError('Please enter the 6-digit OTP code.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    setForgotError('');
    setIsResettingPassword(true);
    try {
      const res = await api.resetPasswordWithOtp(forgotIdentifier, forgotOtp, forgotNewPassword);
      showToast('success', 'Password Reset Successful', res.message || 'You can now sign in with your new password.');
      setPassword(forgotNewPassword);
      setIsForgotModalOpen(false);
      setIsForgotOtpSent(false);
      setForgotOtp('');
      setForgotNewPassword('');
    } catch (err: any) {
      setForgotError(err.message || 'Password reset failed.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Demo Login Helper
  const loginAsDemoUser = async (userEmail: string, userPass: string, fallbackRole: UserRole, label: string) => {
    setIsLoading(true);
    setEmail(userEmail);
    setPassword(userPass);
    try {
      const authData = await api.login(userEmail, userPass);
      let userRole: UserRole = fallbackRole;
      if (authData.role === 'ROLE_SUPER_ADMIN') userRole = 'super_admin';
      else if (authData.role === 'ROLE_ADMIN') userRole = 'admin';
      else if (authData.role === 'ROLE_RESIDENT') userRole = 'resident';
      
      setRole(userRole);
      showToast('success', `${label} Access Granted`, `Welcome ${authData.name} (${authData.societyName || 'Portal'})`);
      if (userRole === 'super_admin') navigate('/super-admin');
      else if (userRole === 'admin') navigate('/admin');
      else navigate('/resident');
    } catch {
      setRole(fallbackRole);
      showToast('success', `Demo Mode: ${label}`, 'Exploring system with demo profile');
      if (fallbackRole === 'super_admin') navigate('/super-admin');
      else if (fallbackRole === 'admin') navigate('/admin');
      else navigate('/resident');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800/50">
        
        {/* Left Side: SaaS Brand Presentation */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl tracking-tight text-white">SocietySaaS</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Multi-Tenant
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Enterprise Housing Cloud Platform</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                Multi-society management, mobile OTP security, and role-isolated dashboards.
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Super Admin SaaS portal, Society Secretary Admin panels with mobile verification, and individual Resident flat billing & dues tracking.
              </p>
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-8 space-y-2.5 relative z-10">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Multi-Tenant <code>society_id</code> Isolation & Tenant Security</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Mobile Number & 6-Digit OTP Password Resets</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Admin-Provisioned Resident Flat Accounts</span>
            </div>
          </div>

          {/* Bottom Society Tag */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Powered by <strong>SocietySaaS Engine</strong></span>
            <span className="font-mono text-[10px]">v3.2 Multi-Tenant</span>
          </div>
        </div>

        {/* Right Side: Form (Sign In / Register) */}
        <div className="lg:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Society Admin</span>
              </button>
            </div>

            {mode === 'signin' ? (
              <>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Sign in via Email or Registered Mobile Number</p>
                </div>

                {/* Sign In Form */}
                <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email or Mobile Number</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@greenvalleyresidency.in or +91 98250 11223"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotIdentifier(email || '+91 98250 11223');
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        Forgot password with OTP?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="admin123 or resident123"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Portal</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Quick Demo Access Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      1-Click Verified Demo Logins
                    </span>
                  </div>
                </div>

                {/* 5-Account Multi-Tenant Demo Selector */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {/* Super Admin */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => loginAsDemoUser('superadmin@societysaas.com', 'admin123', 'super_admin', 'Super Admin')}
                      className="p-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900 font-bold flex flex-col items-center text-center transition-all hover:border-amber-300 group disabled:opacity-50"
                    >
                      <div className="p-1 rounded-lg bg-amber-600 text-white mb-0.5 shadow-soft-sm group-hover:scale-105 transition-transform">
                        <Crown className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] leading-tight">Super Admin</span>
                      <span className="text-[8px] text-amber-700 font-normal">All Societies</span>
                    </button>

                    {/* Green Valley Admin */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => loginAsDemoUser('admin@greenvalleyresidency.in', 'admin123', 'admin', 'Green Valley Admin')}
                      className="p-2 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900 font-bold flex flex-col items-center text-center transition-all hover:border-indigo-300 group disabled:opacity-50"
                    >
                      <div className="p-1 rounded-lg bg-indigo-600 text-white mb-0.5 shadow-soft-sm group-hover:scale-105 transition-transform">
                        <Shield className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] leading-tight">Green Valley</span>
                      <span className="text-[8px] text-indigo-700 font-normal">Society Admin</span>
                    </button>

                    {/* Royal Palm Admin */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => loginAsDemoUser('admin@royalpalm.in', 'admin123', 'admin', 'Royal Palm Admin')}
                      className="p-2 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-900 font-bold flex flex-col items-center text-center transition-all hover:border-purple-300 group disabled:opacity-50"
                    >
                      <div className="p-1 rounded-lg bg-purple-600 text-white mb-0.5 shadow-soft-sm group-hover:scale-105 transition-transform">
                        <Building2 className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] leading-tight">Royal Palm</span>
                      <span className="text-[8px] text-purple-700 font-normal">Society Admin</span>
                    </button>
                  </div>

                  {/* Residents Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => loginAsDemoUser('rahul.sharma@greenvalleyresidency.in', 'resident123', 'resident', 'Rahul Sharma')}
                      className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 font-bold flex items-center justify-center gap-2 transition-all hover:border-emerald-300 disabled:opacity-50"
                    >
                      <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold leading-tight">Rahul (Green Valley)</p>
                        <p className="text-[8px] text-emerald-700 font-normal">Flat A-101 · +91 98765 43210</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => loginAsDemoUser('aditya.roy@royalpalm.in', 'resident123', 'resident', 'Aditya Roy')}
                      className="p-2 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-teal-900 font-bold flex items-center justify-center gap-2 transition-all hover:border-teal-300 disabled:opacity-50"
                    >
                      <Home className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold leading-tight">Aditya (Royal Palm)</p>
                        <p className="text-[8px] text-teal-700 font-normal">Flat B-201 · +91 98220 88990</p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register Society Admin</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Residents are provisioned by Society Admin with mobile numbers.
                  </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Rajesh Kulkarni"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="admin@mysociety.in"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                    <p className="font-bold flex items-center gap-1.5 mb-0.5">
                      <Shield className="w-3.5 h-3.5 text-amber-700" /> Multi-Tenant Role Note:
                    </p>
                    Only Society Administrators can provision flat resident user accounts. Resident members will receive their credentials directly from their building committee.
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Registering Admin...</span>
                        </>
                      ) : (
                        <>
                          <span>Register Society Admin</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password / Mobile OTP Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Reset Password via Mobile OTP</h3>
                  <p className="text-[11px] text-slate-500">Verify your registered mobile number</p>
                </div>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registered Mobile Number or Email</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="+91 98250 11223"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendForgotOtp}
                    disabled={isSendingForgotOtp}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shrink-0 transition-colors"
                  >
                    {isSendingForgotOtp ? 'Sending...' : (isForgotOtpSent ? 'Resend' : 'Send OTP')}
                  </button>
                </div>
              </div>

              {isForgotOtpSent && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Enter 6-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 123456"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-center font-black text-sm tracking-widest text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">New Password (Min. 6 Characters)</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Enter new strong password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {forgotMessage && (
                <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  ✓ {forgotMessage}
                </p>
              )}
              {forgotError && (
                <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                  ⚠️ {forgotError}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isForgotOtpSent || isResettingPassword}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-soft transition-colors flex items-center gap-1.5"
                >
                  {isResettingPassword ? 'Resetting...' : 'Update Password & Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
