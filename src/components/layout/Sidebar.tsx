import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSociety } from '../../context/SocietyContext';
import {
  LayoutDashboard,
  Building,
  Building2,
  Home,
  Users,
  CreditCard,
  Receipt,
  TrendingDown,
  FileBarChart,
  Bell,
  MessageSquareWarning,
  Settings,
  Shield,
  Layers,
  FileText,
  User,
  X,
  LucideIcon,
  Crown,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    role,
    complaints,
    notices,
    maintenanceRecords,
    currentResidentFlat,
    societySettings,
    societies,
    currentSociety,
    platformStats
  } = useSociety();

  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;
  const pendingDuesCount = maintenanceRecords.filter((m) => m.status !== 'Paid').length;
  const residentFlatNum = currentResidentFlat?.flatNumber || 'A-101';

  const superAdminNavItems: NavItem[] = [
    { label: 'SaaS Platform Hub', path: '/super-admin', icon: Crown, exact: true },
    { label: 'All Societies & Billing', path: '/super-admin', icon: Building2, badge: `${societies.length}` },
    { label: 'Society Admin View', path: '/admin', icon: Shield },
    { label: 'Resident Portal View', path: '/resident', icon: Home },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Blocks & Flats', path: '/admin/flats', icon: Building, badge: `${societySettings.totalFlats || 120}` },
    { label: 'Residents', path: '/admin/residents', icon: Users, badge: '108' },
    { label: 'Maintenance', path: '/admin/maintenance', icon: Layers, badge: `${pendingDuesCount} Due` },
    { label: 'Payments', path: '/admin/payments', icon: Receipt },
    { label: 'Expenses', path: '/admin/expenses', icon: TrendingDown },
    { label: 'Financial Reports', path: '/admin/reports', icon: FileBarChart },
    { label: 'Notices & Circulars', path: '/admin/notices', icon: Bell, badge: `${notices.length}` },
    { label: 'Complaints & Helpdesk', path: '/admin/complaints', icon: MessageSquareWarning, badge: `${openComplaintsCount}`, badgeColor: 'bg-rose-100 text-rose-700' },
    { label: 'Society Settings', path: '/admin/settings', icon: Settings },
  ];

  const residentNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/resident', icon: LayoutDashboard, exact: true },
    { label: `My Flat (${residentFlatNum})`, path: '/resident/my-flat', icon: Home },
    { label: 'Maintenance & Dues', path: '/resident/maintenance', icon: Layers, badge: '₹3,500' },
    { label: 'Payment History', path: '/resident/payments', icon: Receipt },
    { label: 'Society Notices', path: '/resident/notices', icon: Bell, badge: `${notices.length}` },
    { label: 'My Complaints', path: '/resident/complaints', icon: MessageSquareWarning, badge: '1 Open' },
    { label: 'Resident Profile', path: '/resident/profile', icon: User },
  ];

  const navItems = role === 'super_admin'
    ? superAdminNavItems
    : (role === 'admin' ? adminNavItems : residentNavItems);

  const activeSocietyName = currentSociety?.name || societySettings.name;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out flex flex-col no-print lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Role Indicator */}
        <div className="p-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              role === 'super_admin'
                ? 'bg-amber-100 text-amber-800'
                : role === 'admin'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {role === 'super_admin' ? <Crown className="w-4 h-4" /> : (role === 'admin' ? <Shield className="w-4 h-4" /> : <Home className="w-4 h-4" />)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {role === 'super_admin' ? 'Super Admin Portal' : (role === 'admin' ? 'Admin Portal' : 'Resident Portal')}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                {role === 'super_admin' ? 'Multi-Tenant SaaS' : activeSocietyName}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-soft font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer Info Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          {role === 'super_admin' ? (
            <div className="p-3 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl shadow-soft">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Total MRR</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Live</span>
              </div>
              <p className="text-base font-black text-white">
                ₹{((platformStats?.monthlyRecurringRevenue || 4998)).toLocaleString('en-IN')}/mo
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5">{societies.length} Subscribed Societies</p>
            </div>
          ) : (
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-soft-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan Status</span>
                <span className="text-[10px] font-bold text-emerald-600">● Active</span>
              </div>
              <p className="text-xs font-black text-slate-900">{currentSociety?.subscriptionPlan || 'GROWTH'} Plan</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Renews: {currentSociety?.planExpiresAt || '25 Aug 2027'}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
