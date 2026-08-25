import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { api } from '../../services/api';
import {
  Phone,
  HeartHandshake,
  Lock,
  KeyRound,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';

export const ResidentProfilePage: React.FC = () => {
  const { authUser, currentResidentProfile, residents, societySettings, showToast } = useSociety();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Find matching resident profile from backend or use authUser profile
  const matchedResident = residents.find(
    (r) => (authUser?.flatNumber && r.flatNumber === authUser.flatNumber) ||
           (authUser?.email && r.email?.toLowerCase() === authUser.email.toLowerCase())
  ) || currentResidentProfile;

  const residentName = authUser?.name || matchedResident?.name || 'Resident';
  const residentEmail = authUser?.email || matchedResident?.email || 'resident@society.in';
  const residentFlat = authUser?.flatNumber || matchedResident?.flatNumber || 'A-101';
  const residentBlock = matchedResident?.block || (residentFlat.length > 0 ? residentFlat.charAt(0) : 'A');
  const residentPhone = matchedResident?.phone || '+91 98765 43210';
  const residentAlternatePhone = matchedResident?.alternatePhone;
  const residentOwnership = matchedResident?.ownership || 'Resident Member';
  const emergencyName = matchedResident?.emergencyContact?.name || 'Emergency Contact';
  const emergencyPhone = matchedResident?.emergencyContact?.phone || '+91 98765 00000';
  const emergencyRelation = matchedResident?.emergencyContact?.relation || 'Family / Next of Kin';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('error', 'Weak Password', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Mismatch', 'New password and confirmation do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      showToast('success', 'Password Changed', 'Your security password has been updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Could not update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resident Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage personal information, emergency contacts, and security credentials</p>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black ring-4 ring-white/10 shadow-soft shrink-0">
          {residentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-white">{residentName}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {residentOwnership}
            </span>
          </div>
          <p className="text-xs text-indigo-200">
            Flat {residentFlat} · Block {residentBlock} · {societySettings.name}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4 text-indigo-600" /> Contact Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Registered Phone</span>
              <span className="font-bold text-slate-800">{residentPhone}</span>
            </div>
            {residentAlternatePhone && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Alternate / Emergency No.</span>
                <span className="font-bold text-slate-800">{residentAlternatePhone}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Email Address</span>
              <span className="font-bold text-slate-800">{residentEmail}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400 font-medium">Resident ID</span>
              <span className="font-mono font-bold text-slate-700">RES-{residentFlat}</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <HeartHandshake className="w-4 h-4 text-rose-600" /> Emergency Contact
          </h3>
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">{emergencyName}</span>
            <div className="flex justify-between text-xs text-rose-800">
              <span>Relation: <strong>{emergencyRelation}</strong></span>
              <span className="font-mono font-bold">{emergencyPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security & Password
          </h3>
          <span className="text-[11px] text-slate-400">BCrypt 256-bit Encrypted</span>
        </div>

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Current Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Confirm New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
