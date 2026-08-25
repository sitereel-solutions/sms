import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import { Resident } from '../../types';
import { Users, Search, Plus, UserCheck, Phone, Mail, Home, Filter, Send, Eye, Edit } from 'lucide-react';
import { AddResidentModal, EditResidentModal } from '../../components/modals/ResidentDetailModal';

export const ResidentsPage: React.FC = () => {
  const { residents, setSelectedResident, sendReminder } = useSociety();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedOwnership, setSelectedOwnership] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('Active');
  const [isAddResidentOpen, setIsAddResidentOpen] = useState<boolean>(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  const filteredResidents = residents.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone.includes(searchQuery) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBlock = selectedBlock === 'All' || res.block === selectedBlock;
    const matchesOwnership = selectedOwnership === 'All' || res.ownership === selectedOwnership;
    const matchesStatus = selectedStatus === 'All' || res.status === selectedStatus;

    return matchesSearch && matchesBlock && matchesOwnership && matchesStatus;
  });

  const ownersCount = residents.filter((r) => r.ownership === 'Owner').length;
  const tenantsCount = residents.filter((r) => r.ownership === 'Tenant').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Residents Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              108 Active Residents
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Directory of owners, tenants, and emergency contact details</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddResidentOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Add Resident
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Residents</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">108 Members</p>
          <span className="text-[10px] text-slate-400">100% KYC Verified</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Flat Owners</span>
          <p className="text-xl font-black text-indigo-600 mt-0.5">{ownersCount} Owners</p>
          <span className="text-[10px] text-indigo-600 font-semibold">{Math.round((ownersCount / 108) * 100)}% of residents</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Tenants</span>
          <p className="text-xl font-black text-purple-600 mt-0.5">{tenantsCount} Tenants</p>
          <span className="text-[10px] text-slate-400">Registered leases</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Family Size</span>
          <p className="text-xl font-black text-emerald-600 mt-0.5">3.4 Members</p>
          <span className="text-[10px] text-slate-400">~365 Total population</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search residents by name, flat (e.g. A-101), phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Blocks</option>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((b) => (
                <option key={b} value={b}>Block {b}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Active">Active </option>
              <option value="Inactive">Inactive</option>
              <option value="All">ALL</option>
            </select>
            <select
              value={selectedOwnership}
              onChange={(e) => setSelectedOwnership(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Ownership</option>
              <option value="Owner">Owners Only</option>
              <option value="Tenant">Tenants Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Resident</th>
                <th className="py-3.5 px-4">Flat</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Ownership</th>
                <th className="py-3.5 px-4">Monthly Maintenance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map((res) => (
                <tr
                  key={res.id}
                  onClick={() => setSelectedResident(res)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${res.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-soft-sm shrink-0`}>
                        {res.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{res.name}</p>
                        <p className="text-[11px] text-slate-500">{res.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-indigo-600">
                    Flat {res.flatNumber}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">{res.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(res.ownership)}`}>
                      {res.ownership}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">{formatCurrency(res.maintenanceAmount)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {res.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendReminder(res.flatNumber, res.name, res.maintenanceAmount);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-[11px] transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Remind
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingResident(res);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] transition-colors flex items-center gap-1"
                        title="Edit Resident Profile"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResident(res);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resident Modal */}
      <AddResidentModal isOpen={isAddResidentOpen} onClose={() => setIsAddResidentOpen(false)} />

      {/* Edit Resident Modal */}
      <EditResidentModal
        isOpen={Boolean(editingResident)}
        resident={editingResident}
        onClose={() => setEditingResident(null)}
      />
    </div>
  );
};
