import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import {
  Building2,
  Search,
  Plus,
  Grid,
  List,
  Home,
  User,
  Car,
  Zap,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AddFlatModal } from '../../components/modals/FlatDetailModal';

export const FlatsPage: React.FC = () => {
  const { flats, setSelectedFlat } = useSociety();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [isAddFlatOpen, setIsAddFlatOpen] = useState<boolean>(false);

  const filteredFlats = flats.filter((flat) => {
    const matchesSearch =
      flat.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flat.residentName && flat.residentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      flat.parkingSlot.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBlock = selectedBlock === 'All' || flat.block === selectedBlock;
    const matchesStatus =
      selectedStatus === 'All'
        ? true
        : selectedStatus === 'Occupied'
        ? flat.occupancyStatus === 'Occupied'
        : selectedStatus === 'Vacant'
        ? flat.occupancyStatus === 'Vacant'
        : flat.maintenanceStatus === selectedStatus;

    const matchesFloor = selectedFloor === 'All' || flat.floor === Number(selectedFloor);

    return matchesSearch && matchesBlock && matchesStatus && matchesFloor;
  });

  const occupiedCount = flats.filter((f) => f.occupancyStatus === 'Occupied').length;
  const vacantCount = flats.filter((f) => f.occupancyStatus === 'Vacant').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Flats & Units</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              120 Total Flats
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage all flats, ownership records, and resident allocations</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddFlatOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-soft transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> + Add Flat
        </button>
      </div>

      {/* Summary Mini Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Units</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">120 Flats</p>
          <span className="text-[10px] text-slate-400">6 Blocks (A - F)</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Occupied</span>
          <p className="text-xl font-black text-blue-600 mt-0.5">{occupiedCount} Flats</p>
          <span className="text-[10px] text-blue-600 font-semibold">90% Occupancy</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Vacant</span>
          <p className="text-xl font-black text-slate-700 mt-0.5">{vacantCount} Flats</p>
          <span className="text-[10px] text-slate-400">Available for move-in</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Billing Rate</span>
          <p className="text-xl font-black text-emerald-600 mt-0.5">₹3,500 /mo</p>
          <span className="text-[10px] text-slate-400">Standard 2 BHK base</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search flats (e.g. A-101), resident names, parking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Block Filter */}
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

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Occupied">Occupied</option>
              <option value="Vacant">Vacant</option>
              <option value="Paid">Maintenance Paid</option>
              <option value="Pending">Maintenance Pending</option>
              <option value="Overdue">Maintenance Overdue</option>
            </select>

            {/* Floor Filter */}
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Floors</option>
              {[1, 2, 3, 4, 5].map((fl) => (
                <option key={fl} value={fl}>Floor {fl}</option>
              ))}
            </select>

            {/* Grid / List View Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-soft-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-indigo-600 shadow-soft-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flats Render (Grid or List) */}
      {filteredFlats.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700 text-sm">No flats match the selected filters</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your block, status, or search keywords.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFlats.map((flat) => {
            const isVacant = flat.occupancyStatus === 'Vacant';
            return (
              <div
                key={flat.id}
                onClick={() => setSelectedFlat(flat)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-md hover:border-indigo-300 p-5 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {flat.flatNumber}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">Green Valley Residency</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(flat.maintenanceStatus)}`}>
                      ● {isVacant ? 'Vacant' : flat.maintenanceStatus}
                    </span>
                  </div>

                  {/* Resident Info */}
                  <div className="py-3">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {isVacant ? 'Vacant Flat' : flat.residentName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-indigo-600">{flat.bhk}</span>
                      <span>·</span>
                      <span>Floor {flat.floor}</span>
                      <span>·</span>
                      <span>{flat.areaSqFt} sq.ft</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Maintenance</span>
                    <span className="font-black text-slate-900">{formatCurrency(flat.monthlyMaintenance)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Parking</span>
                    <span className="font-mono font-bold text-slate-700">{flat.parkingSlot}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Flat Number</th>
                  <th className="py-3 px-4">Resident</th>
                  <th className="py-3 px-4">BHK & Area</th>
                  <th className="py-3 px-4">Floor & Block</th>
                  <th className="py-3 px-4">Parking Slot</th>
                  <th className="py-3 px-4">Maintenance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFlats.map((flat) => (
                  <tr
                    key={flat.id}
                    onClick={() => setSelectedFlat(flat)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">{flat.flatNumber}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{flat.residentName || 'Vacant'}</p>
                      <p className="text-[11px] text-slate-500">{flat.ownershipType}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {flat.bhk} ({flat.areaSqFt} sq.ft)
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Floor {flat.floor} · Block {flat.block}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{flat.parkingSlot}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatCurrency(flat.monthlyMaintenance)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(flat.maintenanceStatus)}`}>
                        ● {flat.occupancyStatus === 'Vacant' ? 'Vacant' : flat.maintenanceStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFlat(flat);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Flat Modal */}
      <AddFlatModal isOpen={isAddFlatOpen} onClose={() => setIsAddFlatOpen(false)} />
    </div>
  );
};
