import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { SocietySettings } from '../../types';
import {
  Settings,
  Building2,
  Sliders,
  Landmark,
  Bell,
  Users,
  ShieldCheck,
  Save,
  QrCode,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { societySettings, updateSocietySettings, showToast } = useSociety();
  const [activeTab, setActiveTab] = useState<'info' | 'maintenance' | 'payment' | 'notifications' | 'committee'>('info');

  const [formData, setFormData] = useState<SocietySettings>(societySettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocietySettings(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Society Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage society profile, maintenance billing rules, bank accounts, and committee members</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'info', label: 'Society Information', icon: Building2 },
          { id: 'maintenance', label: 'Maintenance Rules', icon: Sliders },
          { id: 'payment', label: 'Bank & UPI Settings', icon: Landmark },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'committee', label: 'Committee Members', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-soft font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-6 text-xs">
        {/* Section 1: Society Information */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" /> Society Profile & Registration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Society Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">City, State & Pincode</label>
                <input
                  type="text"
                  value={`${formData.city}, ${formData.state} - ${formData.pincode}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setFormData({ ...formData, city: parts[0]?.trim() || formData.city });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Society Contact</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Maintenance Settings */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" /> Maintenance Billing Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Standard Flat Fee (₹ / month)</label>
                <input
                  type="number"
                  value={formData.maintenanceConfig.defaultFlatRate}
                  onChange={(e) => setFormData({
                    ...formData,
                    maintenanceConfig: { ...formData.maintenanceConfig, defaultFlatRate: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bill Generation Day</label>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={formData.maintenanceConfig.billingDayOfMonth}
                  onChange={(e) => setFormData({
                    ...formData,
                    maintenanceConfig: { ...formData.maintenanceConfig, billingDayOfMonth: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Due Day</label>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={formData.maintenanceConfig.dueDayOfMonth}
                  onChange={(e) => setFormData({
                    ...formData,
                    maintenanceConfig: { ...formData.maintenanceConfig, dueDayOfMonth: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Late Fine (₹ / week)</label>
                <input
                  type="number"
                  value={formData.maintenanceConfig.lateFeePerWeek}
                  onChange={(e) => setFormData({
                    ...formData,
                    maintenanceConfig: { ...formData.maintenanceConfig, lateFeePerWeek: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Water Charge (₹ / flat)</label>
                <input
                  type="number"
                  value={formData.maintenanceConfig.waterChargePerFlat}
                  onChange={(e) => setFormData({
                    ...formData,
                    maintenanceConfig: { ...formData.maintenanceConfig, waterChargePerFlat: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sinking Fund Reserve (%)</label>
                <input
                  type="number"
                  value={formData.maintenanceConfig.sinkingFundPercentage}
                  onChange={(e) => setFormData({
                    ...formData,
                    maintenanceConfig: { ...formData.maintenanceConfig, sinkingFundPercentage: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Payment Settings */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600" /> Bank Account & UPI Setup
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bank Account Name</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountName}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, accountName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  value={`${formData.bankDetails.bankName}, ${formData.bankDetails.branch}`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.bankDetails.ifsc}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, ifsc: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <label className="font-bold text-indigo-950 block mb-1">Society UPI Virtual ID</label>
                  <p className="text-slate-600 text-xs">Used for generating dynamic QR codes in resident portal.</p>
                  <span className="font-mono font-bold text-indigo-700 text-sm mt-1 block">{formData.bankDetails.upiId}</span>
                </div>
                <QrCode className="w-12 h-12 text-indigo-900" />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" /> Automated Reminder Channels
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">WhatsApp Due Date Alerts</span>
                  <span className="text-slate-500 text-[11px]">Send automated payment link 3 days before 10th of every month.</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Email Invoices & Digital Receipts</span>
                  <span className="text-slate-500 text-[11px]">Instantly send PDF voucher upon successful payment receipt.</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Emergency Water & Lift SMS Broadcast</span>
                  <span className="text-slate-500 text-[11px]">High priority SMS to all 108 residents for urgent disruptions.</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
              </label>
            </div>
          </div>
        )}

        {/* Section 5: Committee Members */}
        {activeTab === 'committee' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Management Committee Directory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.committeeMembers.map((member, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {member.role}
                    </span>
                    <span className="font-bold text-slate-700">Flat {member.flatNumber}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {member.phone}</p>
                    <p className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer save */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-soft transition-colors flex items-center gap-1.5 text-xs"
          >
            <CheckCircle2 className="w-4 h-4" /> Update Society Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
