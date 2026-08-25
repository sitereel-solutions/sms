import React, { useState } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import { X, Home, User, Phone, Mail, Car, Zap, Flame, Calendar, DollarSign, Send } from 'lucide-react';

export const FlatDetailModal: React.FC = () => {
  const { selectedFlat, setSelectedFlat, sendReminder } = useSociety();

  if (!selectedFlat) return null;

  const isOccupied = selectedFlat.occupancyStatus === 'Occupied';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base">Flat {selectedFlat.flatNumber}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeClasses(selectedFlat.maintenanceStatus)}`}>
                  ● {selectedFlat.maintenanceStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">Block {selectedFlat.block} · Floor {selectedFlat.floor} · {selectedFlat.bhk} ({selectedFlat.areaSqFt} sq.ft)</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFlat(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Main Info Card */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-slate-400 font-medium block">Occupancy</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedFlat.occupancyStatus}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Ownership</span>
              <span className="font-bold text-indigo-600 text-sm mt-0.5 block">{selectedFlat.ownershipType}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Monthly Dues</span>
              <span className="font-bold text-emerald-600 text-sm mt-0.5 block">{formatCurrency(selectedFlat.monthlyMaintenance)}</span>
            </div>
          </div>

          {/* Resident Details */}
          {isOccupied && selectedFlat.residentName ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" /> Resident Details
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Full Name</span>
                  <span className="font-semibold text-slate-800">{selectedFlat.residentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Contact Number</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {selectedFlat.residentPhone || 'N/A'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Email Address</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {selectedFlat.residentEmail || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
              <Home className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">This flat is currently Vacant</p>
              <p className="text-slate-400 text-xs mt-0.5">Ready for new tenant or owner registration.</p>
            </div>
          )}

          {/* Utilities & Parking Details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <span className="font-bold text-slate-800 text-sm">Allocated Assets & Utility Meters</span>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block flex items-center gap-1">
                  <Car className="w-3 h-3 text-slate-500" /> Parking Slot
                </span>
                <span className="font-bold text-slate-800 mt-1 block">{selectedFlat.parkingSlot}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Power Meter
                </span>
                <span className="font-mono font-bold text-slate-800 mt-1 block truncate">{selectedFlat.electricityMeter}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium block flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> Piped Gas
                </span>
                <span className="font-mono font-bold text-slate-800 mt-1 block truncate">{selectedFlat.gasMeter}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {selectedFlat.maintenanceStatus !== 'Paid' && selectedFlat.residentName ? (
            <button
              onClick={() => sendReminder(selectedFlat.flatNumber, selectedFlat.residentName!, selectedFlat.monthlyMaintenance)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-soft transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send Reminder
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => setSelectedFlat(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const AddFlatModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addFlat } = useSociety();

  const [flatNumber, setFlatNumber] = useState<string>('');
  const [block, setBlock] = useState<string>('A');
  const [floor, setFloor] = useState<number>(1);
  const [bhk, setBhk] = useState<'1 BHK' | '2 BHK' | '3 BHK' | '4 BHK'>('2 BHK');
  const [areaSqFt, setAreaSqFt] = useState<number>(1150);
  const [occupancyStatus, setOccupancyStatus] = useState<'Occupied' | 'Vacant'>('Vacant');
  const [ownershipType, setOwnershipType] = useState<'Owner' | 'Tenant' | 'Vacant'>('Vacant');
  const [residentName, setResidentName] = useState<string>('');
  const [residentPhone, setResidentPhone] = useState<string>('');
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number>(3500);
  const [parkingSlot, setParkingSlot] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNumber) return;

    addFlat({
      flatNumber,
      block,
      floor: Number(floor),
      bhk,
      areaSqFt: Number(areaSqFt),
      occupancyStatus,
      ownershipType: occupancyStatus === 'Vacant' ? 'Vacant' : ownershipType,
      residentName: occupancyStatus === 'Occupied' ? residentName : undefined,
      residentPhone: occupancyStatus === 'Occupied' ? residentPhone : undefined,
      monthlyMaintenance: Number(monthlyMaintenance),
      maintenanceStatus: 'Paid',
      parkingSlot: parkingSlot || `P-${Math.floor(100 + Math.random() * 900)}`,
      electricityMeter: `EL-GV-${flatNumber}`,
      gasMeter: `PNG-GV-${flatNumber}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Add New Flat Unit</h3>
              <p className="text-xs text-slate-500">Register a new residential apartment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Flat Number</label>
              <input
                type="text"
                required
                placeholder="e.g. G-101"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Block</label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((b) => (
                  <option key={b} value={b}>Block {b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Floor</label>
              <input
                type="number"
                min={1}
                max={15}
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Apartment Type</label>
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Super Built-up Area (sq.ft)</label>
              <input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Occupancy Status</label>
              <select
                value={occupancyStatus}
                onChange={(e) => setOccupancyStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Monthly Maintenance (₹)</label>
              <input
                type="number"
                value={monthlyMaintenance}
                onChange={(e) => setMonthlyMaintenance(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {occupancyStatus === 'Occupied' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-semibold text-slate-800 block">Resident Info</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-600 block mb-1">Resident Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Patel"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-600 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 98765 43210"
                    value={residentPhone}
                    onChange={(e) => setResidentPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-soft transition-colors">
              Add Flat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
