import React from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency } from '../../utils/formatters';
import { Home, Building2, Car, Zap, Flame, User, ShieldCheck, FileCheck, Layers } from 'lucide-react';

export const ResidentMyFlatPage: React.FC = () => {
  const { authUser, flats, residents, currentResidentFlat, currentResidentProfile, societySettings } = useSociety();

  const userFlatNum = authUser?.flatNumber || currentResidentFlat?.flatNumber || 'A-101';
  const flat = flats.find((f) => f.flatNumber === userFlatNum) || currentResidentFlat || {
    flatNumber: userFlatNum,
    block: userFlatNum.length > 0 ? userFlatNum.charAt(0) : 'A',
    floor: 1,
    bhk: '2 BHK' as const,
    areaSqFt: 1150,
    monthlyMaintenance: 3500,
    parkingSlot: `P-${userFlatNum.replace('-', '')}`,
    electricityMeter: `EL-GV-${userFlatNum.replace('-', '')}`,
    gasMeter: `PNG-${userFlatNum.replace('-', '')}`,
    ownershipType: 'Owner' as const,
    maintenanceStatus: 'Paid' as const,
  };

  const matchedResident = residents.find(
    (r) => (authUser?.flatNumber && r.flatNumber === authUser.flatNumber) ||
           (authUser?.email && r.email?.toLowerCase() === authUser.email.toLowerCase())
  ) || currentResidentProfile;

  const resident = {
    name: authUser?.name || matchedResident?.name || 'Resident',
    phone: matchedResident?.phone || '+91 98765 43210',
    email: authUser?.email || matchedResident?.email || 'resident@society.in',
    memberCount: matchedResident?.memberCount || 2,
    moveInDate: matchedResident?.moveInDate || '2023-01-01',
    vehicles: matchedResident?.vehicles || [
      { type: 'Car' as const, model: 'Vehicle', number: 'GJ-01-AB-1234' }
    ],
    emergencyContact: matchedResident?.emergencyContact || {
      name: 'Emergency Contact',
      phone: '+91 98765 00000',
      relation: 'Family',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Apartment Unit (Flat {flat.flatNumber})</h1>
        <p className="text-xs text-slate-500 mt-0.5">Specifications, allocated utility meters, parking slot, and registered occupancy</p>
      </div>

      {/* Main Flat Overview Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
            <Building2 className="w-3.5 h-3.5" /> Block {flat.block} · Floor {flat.floor} · {flat.bhk}
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Flat {flat.flatNumber}</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Premium residential apartment at {societySettings.name}. Carpet area: 980 sq.ft, Super built-up area: {flat.areaSqFt} sq.ft. Complete with designated basement parking and piped gas utility.
          </p>
        </div>

        <div className="p-5 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl border border-indigo-100/80 text-center space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Society Maintenance</span>
          <p className="text-3xl font-black text-indigo-700">{formatCurrency(flat.monthlyMaintenance)}</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            ● Status: Paid (Up to Date)
          </span>
        </div>
      </div>

      {/* Allocated Utility Meters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Dedicated Parking Slot</span>
            <Car className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{flat.parkingSlot}</p>
          <span className="text-xs text-slate-500 font-medium">Covered Basement Ramp 1</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Electricity Sub-Meter</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-mono font-bold text-slate-900">{flat.electricityMeter}</p>
          <span className="text-xs text-slate-500 font-medium">Torrent Power Connected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Piped Natural Gas</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xl font-mono font-bold text-slate-900">{flat.gasMeter}</p>
          <span className="text-xs text-slate-500 font-medium">Adani Gas Ltd Connection</span>
        </div>
      </div>

      {/* Occupancy & Vehicle Registry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Family Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" /> Registered Occupants & Ownership
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Primary Member</span>
              <span className="font-bold text-slate-800">{resident.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Ownership Type</span>
              <span className="font-bold text-indigo-600">Flat Owner (Title Holder)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Registered Family Count</span>
              <span className="font-bold text-slate-800">{resident.memberCount} Residents</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400 font-medium">Move-in Date</span>
              <span className="font-bold text-slate-800">{resident.moveInDate}</span>
            </div>
          </div>
        </div>

        {/* Registered Vehicles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <Car className="w-4 h-4 text-indigo-600" /> Registered RFID FastTag Vehicles
          </h3>
          <div className="space-y-3">
            {resident.vehicles.map((v, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{v.model}</span>
                  <span className="text-[10px] text-slate-400">{v.type} · Gate RFID Active</span>
                </div>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {v.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
