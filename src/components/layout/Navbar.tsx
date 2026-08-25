import React, { useState, useRef, useEffect } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Bell,
  ChevronDown,
  Shield,
  Home,
  CheckCircle2,
  Menu,
  CreditCard,
  X,
  Crown,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    role,
    setRole,
    authUser,
    logout,
    showToast,
    societySettings,
    societies,
    currentSociety,
    switchSociety,
    setIsGlobalSearchOpen,
    activities,
    setSelectedReceipt,
    payments,
  } = useSociety();

  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSocietySelectorOpen, setIsSocietySelectorOpen] = useState<boolean>(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const societySelectorRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (societySelectorRef.current && !societySelectorRef.current.contains(event.target as Node)) {
        setIsSocietySelectorOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
        setIsSocietySelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setIsProfileMenuOpen(false);
    showToast(
      'info',
      `Switched to ${newRole === 'super_admin' ? 'Super Admin' : newRole === 'admin' ? 'Admin' : 'Resident'} Portal`,
      `Viewing system as ${newRole === 'super_admin' ? 'Platform Owner' : newRole === 'admin' ? 'Society Administrator' : 'Resident'}`
    );
    if (newRole === 'super_admin') {
      navigate('/super-admin');
    } else if (newRole === 'resident') {
      navigate('/resident');
    } else {
      navigate('/admin');
    }
  };

  const handleSignOut = () => {
    setIsProfileMenuOpen(false);
    logout();
    showToast('info', 'Signed Out', 'You have been signed out of your account.');
    navigate('/login');
  };

  const openReceipt = () => {
    const r = payments.find((p) => p.receiptNumber === 'REC-2026-00842') || payments[0];
    if (r) setSelectedReceipt(r);
  };

  const displayName = authUser?.name || (role === 'super_admin' ? 'Super Admin' : (role === 'admin' ? 'Dr. Vikram Mehta' : 'Rahul Sharma'));
  const displayEmail = authUser?.email || (role === 'super_admin' ? 'superadmin@societysaas.com' : 'admin@greenvalleyresidency.in');
  const displayInitials = displayName
    ? displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'SA';

  const displayRoleSubtitle = role === 'super_admin'
    ? 'SaaS Platform Owner'
    : role === 'admin'
    ? 'Society Administrator'
    : (authUser?.flatNumber ? `Flat ${authUser.flatNumber} · Resident` : 'Resident Member');

  const activeSocietyName = currentSociety?.name || societySettings.name;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-soft-sm no-print">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate(role === 'super_admin' ? '/super-admin' : (role === 'admin' ? '/admin' : '/resident'))}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform ${
              role === 'super_admin'
                ? 'bg-gradient-to-tr from-amber-600 to-indigo-600'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
            }`}>
              {role === 'super_admin' ? <Crown className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  {role === 'super_admin' ? 'SocietySaaS' : 'SocietyHub'}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  role === 'super_admin'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {role === 'super_admin' ? 'SUPER' : 'LIVE'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide -mt-1 hidden sm:block">
                {role === 'super_admin' ? 'Multi-Tenant Platform' : 'Smart Society Management'}
              </p>
            </div>
          </div>

          {/* Society Selector / Badge */}
          <div className="relative hidden md:block" ref={societySelectorRef}>
            <button
              type="button"
              onClick={() => setIsSocietySelectorOpen((prev) => !prev)}
              className="flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[180px] truncate">{activeSocietyName}</span>
              {societies.length > 1 && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {isSocietySelectorOpen && societies.length > 0 && (
              <div className="absolute left-3 top-full mt-2 w-64 bg-white rounded-2xl shadow-soft-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-slate-100 mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Switch Society Tenant</span>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {societies.map((soc) => (
                    <button
                      key={soc.id}
                      type="button"
                      onClick={() => {
                        switchSociety(soc.id);
                        setIsSocietySelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentSociety?.id === soc.id ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate">{soc.name}</p>
                        <span className="text-[10px] text-slate-400 font-normal">{soc.city || 'Gujarat'} · {soc.totalFlats || 120} Flats</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {soc.subscriptionPlan || 'GROWTH'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Trigger Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => setIsGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 text-slate-400 text-xs font-medium transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              <span>Search flats, residents, receipts, invoices...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white rounded border border-slate-200 shadow-soft-sm">
                Ctrl
              </kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white rounded border border-slate-200 shadow-soft-sm">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setIsGlobalSearchOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 md:hidden transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Role Pill Quick Indicator */}
          <div className="hidden sm:flex items-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              role === 'super_admin'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : role === 'admin'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {role === 'super_admin' ? <Crown className="w-3.5 h-3.5" /> : (role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />)}
              {role === 'super_admin' ? 'Super Admin' : (role === 'admin' ? 'Admin Portal' : (authUser?.flatNumber ? `Flat ${authUser.flatNumber}` : 'Resident Portal'))}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                setIsProfileMenuOpen(false);
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-600" />
                    <h4 className="font-bold text-slate-800 text-sm">Society Notifications</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      Live Feed
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="py-2 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="py-2.5 flex items-start gap-2.5 text-xs">
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${act.iconColor}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{act.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{act.subtitle}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate(role === 'admin' ? '/admin/notices' : '/resident/notices');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    View All Society Notices & Circulars →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile & Persona Switcher */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-soft ${
                role === 'super_admin' ? 'bg-amber-600' : (role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600')
              }`}>
                {displayInitials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 leading-none">
                  {displayRoleSubtitle}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-50 rounded-xl mb-2 text-xs border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Signed In As</span>
                  <p className="font-bold text-slate-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {displayEmail}
                  </p>
                </div>

                <div className="space-y-1 text-xs font-semibold text-slate-700">
                  {/* Super Admin Quick Links */}
                  {role === 'super_admin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch('super_admin')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left bg-amber-50 text-amber-900 font-bold"
                      >
                        <Crown className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-bold block">Super Admin Platform</span>
                          <span className="text-[10px] text-slate-400 font-normal">All Societies & Subscriptions</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSwitch('admin')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left hover:bg-indigo-50 hover:text-indigo-800"
                      >
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <div>
                          <span className="font-bold block">Inspect Society Admin View</span>
                          <span className="text-[10px] text-slate-400 font-normal">Manage current society & flats</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSwitch('resident')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <Home className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold block">Inspect Resident View</span>
                          <span className="text-[10px] text-slate-400 font-normal">Sample resident portal</span>
                        </div>
                      </button>
                    </>
                  )}

                  {/* Society Admin Context */}
                  {role === 'admin' && (
                    <div className="px-3 py-2 bg-indigo-50 rounded-xl text-indigo-900">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span>Society Administrator</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{activeSocietyName}</p>
                    </div>
                  )}

                  {/* Resident Context */}
                  {role === 'resident' && (
                    <div className="px-3 py-2 bg-emerald-50 rounded-xl text-emerald-900">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Home className="w-4 h-4 text-emerald-600" />
                        <span>Resident Member</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {authUser?.flatNumber ? `Flat ${authUser.flatNumber} · ` : ''}{activeSocietyName}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      openReceipt();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left"
                  >
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span>View Sample Receipt</span>
                  </button>

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
