import React, { useState, useEffect } from 'react';
import { useSociety } from '../../context/SocietyContext';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';
import { Resident } from '../../types';
import { api } from '../../services/api';
import {
  X,
  User,
  Phone,
  PhoneCall,
  Mail,
  Home,
  Shield,
  Car,
  HeartHandshake,
  Calendar,
  Send,
  Plus,
  UserPlus,
  Edit,
  Save,
  CheckCircle2
} from 'lucide-react';

export const ResidentDetailModal: React.FC<{ onEdit?: (resident: Resident) => void }> = ({ onEdit }) => {
  const { selectedResident, setSelectedResident, sendReminder } = useSociety();
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  if (!selectedResident) return null;

  const handleOpenEdit = () => {
    if (onEdit) {
      onEdit(selectedResident);
    } else {
      setIsEditOpen(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          {/* Header with Avatar */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${selectedResident.avatarColor || 'bg-indigo-600'} text-white flex items-center justify-center text-xl font-bold ring-4 ring-white/10 shadow-soft`}>
                {selectedResident.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">{selectedResident.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(selectedResident.ownership)}`}>
                    {selectedResident.ownership}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(selectedResident.status || 'Active')}`}>
                    ● {selectedResident.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-indigo-400" /> Flat {selectedResident.flatNumber} · Block {selectedResident.block}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedResident(null)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-slate-400 font-medium block">Monthly Dues</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{formatCurrency(selectedResident.maintenanceAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Family Members</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedResident.memberCount} Persons</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Member Since</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedResident.moveInDate}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-indigo-600" /> Contact Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 font-medium block">Primary Mobile</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedResident.phone}</span>
                </div>
                <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                  <span className="text-indigo-600 font-medium block flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-indigo-500" /> Alternate / Emergency Number
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedResident.alternatePhone || selectedResident.emergencyContact?.phone || 'Not set'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg sm:col-span-2">
                  <span className="text-slate-400 font-medium block">Email ID</span>
                  <span className="font-semibold text-slate-800 truncate block">{selectedResident.email}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-rose-600" /> Nominated Emergency Contact
              </span>
              <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                <div>
                  <span className="font-bold text-slate-800 block">{selectedResident.emergencyContact?.name || 'Not provided'}</span>
                  <span className="text-[11px] text-rose-700 font-medium">Relationship: {selectedResident.emergencyContact?.relation || 'Relative'}</span>
                </div>
                <div className="font-mono font-bold text-slate-700 text-xs">
                  {selectedResident.emergencyContact?.phone || 'N/A'}
                </div>
              </div>
            </div>

            {/* Registered Vehicles */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Car className="w-4 h-4 text-indigo-600" /> Registered Vehicles & RFID
              </span>
              <div className="space-y-2">
                {selectedResident.vehicles && selectedResident.vehicles.length > 0 ? (
                  selectedResident.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">{v.type}</span>
                        <span className="font-semibold text-slate-800">{v.model}</span>
                      </div>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {v.number}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No registered vehicles</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-soft transition-colors flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                type="button"
                onClick={() => sendReminder(selectedResident.flatNumber, selectedResident.name, selectedResident.maintenanceAmount)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-soft transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Notice
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSelectedResident(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditResidentModal
          isOpen={isEditOpen}
          resident={selectedResident}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
};

export const EditResidentModal: React.FC<{
  isOpen: boolean;
  resident: Resident | null;
  onClose: () => void;
}> = ({ isOpen, resident, onClose }) => {
  const { updateResident, setSelectedResident } = useSociety();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [alternatePhone, setAlternatePhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [ownership, setOwnership] = useState<'Owner' | 'Tenant'>('Owner');
  const [memberCount, setMemberCount] = useState<number>(3);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [emergencyName, setEmergencyName] = useState<string>('');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  const [emergencyRelation, setEmergencyRelation] = useState<string>('Spouse');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (resident) {
      setName(resident.name || '');
      setPhone(resident.phone || '');
      setAlternatePhone(resident.alternatePhone || '');
      setEmail(resident.email || '');
      setOwnership(resident.ownership || 'Owner');
      setMemberCount(resident.memberCount || 1);
      setStatus(resident.status || 'Active');
      const primaryCar = resident.vehicles?.[0];
      setVehicleModel(primaryCar?.model || '');
      setVehicleNumber(primaryCar?.number || '');
      setEmergencyName(resident.emergencyContact?.name || '');
      setEmergencyPhone(resident.emergencyContact?.phone || '');
      setEmergencyRelation(resident.emergencyContact?.relation || 'Spouse');
    }
  }, [resident, isOpen]);

  if (!isOpen || !resident) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      const vehiclesList = vehicleModel || vehicleNumber ? [
        {
          type: 'Car' as const,
          model: vehicleModel || 'Sedan',
          number: vehicleNumber || 'GJ-01-XX-0000',
        },
        ...(resident.vehicles?.slice(1) || [])
      ] : (resident.vehicles || []);

      const updatedData: Partial<Resident> = {
        name,
        phone,
        alternatePhone: alternatePhone.trim() || undefined,
        email,
        ownership,
        memberCount: Number(memberCount),
        status,
        vehicles: vehiclesList,
        emergencyContact: {
          name: emergencyName || 'Relative',
          phone: emergencyPhone || alternatePhone || phone,
          relation: emergencyRelation,
        },
      };

      await updateResident(resident.id, updatedData);
      
      // Update selected resident in context if currently viewing
      setSelectedResident({
        ...resident,
        ...updatedData,
        emergencyContact: {
          name: emergencyName || 'Relative',
          phone: emergencyPhone || alternatePhone || phone,
          relation: emergencyRelation,
        },
        vehicles: vehiclesList,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Edit Resident Information</h3>
              <p className="text-xs text-slate-500">Flat {resident.flatNumber} · Block {resident.block}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          {/* Name & Flat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Flat Assignment</label>
              <input
                type="text"
                disabled
                value={`Flat ${resident.flatNumber} (Block ${resident.block})`}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Primary Phone & Alternate / Emergency Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Phone *</label>
              <input
                type="text"
                required
                placeholder="+91 98250 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-indigo-600" /> Alternate / Emergency No.
              </label>
              <input
                type="text"
                placeholder="+91 98980 67890"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50/30 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="resident@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Active">Active Resident</option>
                <option value="Inactive">Inactive / Moved Out</option>
              </select>
            </div>
          </div>

          {/* Ownership & Family Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ownership Type</label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value as 'Owner' | 'Tenant')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Family Members Count</label>
              <input
                type="number"
                min={1}
                max={15}
                value={memberCount}
                onChange={(e) => setMemberCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Emergency Contact Sub-section */}
          <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-3">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-600" /> Nominated Emergency Contact Details
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Emergency Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 00001"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Brother"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Primary Vehicle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-700 block flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-indigo-600" /> Primary Vehicle Details
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Make & Model</label>
                <input
                  type="text"
                  placeholder="e.g. Honda City"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Plate Number</label>
                <input
                  type="text"
                  placeholder="GJ-01-AB-1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddResidentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { flats, addResident, showToast } = useSociety();
  const vacantFlats = flats.filter((f) => f.occupancyStatus === 'Vacant');

  const [name, setName] = useState<string>('');
  const [flatNumber, setFlatNumber] = useState<string>(vacantFlats[0]?.flatNumber || 'A-404');
  const [phone, setPhone] = useState<string>('');
  const [alternatePhone, setAlternatePhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [ownership, setOwnership] = useState<'Owner' | 'Tenant'>('Owner');
  const [memberCount, setMemberCount] = useState<number>(3);
  const [vehicleModel, setVehicleModel] = useState<string>('Hyundai Creta');
  const [vehicleNumber, setVehicleNumber] = useState<string>('GJ-01-AB-1234');
  const [emergencyName, setEmergencyName] = useState<string>('');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  const [emergencyRelation, setEmergencyRelation] = useState<string>('Spouse');

  // Resident Login Provisioning by Society Admin
  const [createLogin, setCreateLogin] = useState<boolean>(true);
  const [loginPassword, setLoginPassword] = useState<string>('resident123');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetFlat = flats.find((f) => f.flatNumber === flatNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !flatNumber) return;

    setIsSubmitting(true);
    try {
      // 1. Add resident profile
      await addResident({
        name,
        flatNumber,
        block: targetFlat?.block || flatNumber.split('-')[0],
        phone: phone || '',
        alternatePhone: alternatePhone.trim() || undefined,
        email: email || '',
        ownership,
        memberCount: Number(memberCount),
        vehicles: [
          {
            type: 'Car',
            model: vehicleModel || '',
            number: vehicleNumber || '',
          }
        ],
        emergencyContact: {
          name: emergencyName || 'Relative',
          phone: emergencyPhone || alternatePhone || '',
          relation: emergencyRelation,
        },
        maintenanceAmount: targetFlat?.monthlyMaintenance || 3500,
        status: 'Active',
        moveInDate: '' + new Date().toLocaleDateString('en-GB'),
        avatarColor: 'bg-indigo-600',
      });

      // 2. Provision resident login user if checked
      if (createLogin && email && phone) {
        try {
          await api.registerResidentUser({
            name,
            email,
            phone,
            flatNumber,
            password: loginPassword || 'resident123',
          });
          showToast('success', 'Resident Login Created', `Login enabled for ${email} with mobile ${phone}`);
        } catch (authErr: any) {
          console.warn('Resident login account creation notice:', authErr);
        }
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Onboard New Resident</h3>
              <p className="text-xs text-slate-500">Register owner/tenant and provision portal login</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Resident Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alok Singhania"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assign Flat *</label>
              <select
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {flats.map((f) => (
                  <option key={f.flatNumber} value={f.flatNumber}>
                    {f.flatNumber} ({f.occupancyStatus === 'Vacant' ? '★ Vacant' : f.residentName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Mobile Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98250 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-indigo-600" /> Alternate / Emergency No.
              </label>
              <input
                type="text"
                placeholder="+91 98980 67890"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50/30 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ownership Type</label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>
          </div>

          {/* Resident Login Account Provisioning */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950 text-xs">
              <input
                type="checkbox"
                checked={createLogin}
                onChange={(e) => setCreateLogin(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Create Web & Mobile Login Account for Resident</span>
            </label>
            {createLogin && (
              <div className="pt-1">
                <label className="font-semibold text-slate-700 block mb-1">Default Initial Password</label>
                <input
                  type="text"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="resident123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-mono bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Resident can reset password at any time using OTP sent to their mobile number ({phone || 'registered phone'}).
                </p>
              </div>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-700 block">Primary Vehicle</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-600 block mb-1">Make & Model</label>
                <input
                  type="text"
                  placeholder="e.g. Honda City"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Plate Number</label>
                <input
                  type="text"
                  placeholder="GJ-01-AB-1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-soft transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" /> {isSubmitting ? 'Provisioning...' : 'Save & Onboard Resident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
