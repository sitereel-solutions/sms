package com.society.management.service;

import com.society.management.entity.Flat;
import com.society.management.entity.Resident;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.FlatRepository;
import com.society.management.repository.ResidentRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResidentService {

    private final ResidentRepository residentRepository;
    private final FlatRepository flatRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public List<Resident> getAllResidents() {
        if (SecurityUtils.isSuperAdmin()) {
            return residentRepository.findAll();
        }
        String societyId = SecurityUtils.getCurrentSocietyId();
        return residentRepository.findBySocietyId(societyId);
    }

    @Transactional(readOnly = true)
    public Resident getResidentById(String id) {
        return residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Resident getResidentByFlatNumber(String flatNumber) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return residentRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber)
                .or(() -> residentRepository.findByFlatNumber(flatNumber))
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found for flat: " + flatNumber));
    }

    @Transactional
    public Resident createResident(Resident resident) {
        if (resident.getSocietyId() == null || resident.getSocietyId().isBlank()) {
            resident.setSocietyId(SecurityUtils.getCurrentSocietyId());
        }
        if (resident.getId() == null || resident.getId().isBlank()) {
            resident.setId("res-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4));
        }

        // Sync with associated flat
        String societyId = resident.getSocietyId();
        Optional<Flat> optionalFlat = flatRepository.findBySocietyIdAndFlatNumber(societyId, resident.getFlatNumber())
                .or(() -> flatRepository.findByFlatNumber(resident.getFlatNumber()));

        if (optionalFlat.isPresent()) {
            Flat flat = optionalFlat.get();
            flat.setOccupancyStatus("Occupied");
            flat.setOwnershipType(resident.getOwnership());
            flat.setResidentName(resident.getName());
            flat.setResidentPhone(resident.getPhone());
            flat.setResidentEmail(resident.getEmail());
            flatRepository.save(flat);
        }

        Resident saved = residentRepository.save(resident);

        activityService.logActivity(
                "New resident added: " + resident.getName(),
                "Flat " + resident.getFlatNumber() + " · " + resident.getOwnership(),
                "resident",
                "text-blue-600 bg-blue-100"
        );

        return saved;
    }

    @Transactional
    public Resident updateResident(String id, Resident residentDetails) {
        Resident resident = getResidentById(id);
        resident.setName(residentDetails.getName());
        resident.setPhone(residentDetails.getPhone());
        resident.setAlternatePhone(residentDetails.getAlternatePhone());
        resident.setEmail(residentDetails.getEmail());
        resident.setOwnership(residentDetails.getOwnership());
        resident.setMemberCount(residentDetails.getMemberCount());
        resident.setVehicles(residentDetails.getVehicles());
        resident.setEmergencyContact(residentDetails.getEmergencyContact());
        resident.setMaintenanceAmount(residentDetails.getMaintenanceAmount());
        resident.setStatus(residentDetails.getStatus());
        resident.setMoveInDate(residentDetails.getMoveInDate());
        resident.setAvatarColor(residentDetails.getAvatarColor());

        // Update flat details as well
        String societyId = resident.getSocietyId() != null ? resident.getSocietyId() : SecurityUtils.getCurrentSocietyId();
        Optional<Flat> optionalFlat = flatRepository.findBySocietyIdAndFlatNumber(societyId, resident.getFlatNumber())
                .or(() -> flatRepository.findByFlatNumber(resident.getFlatNumber()));

        if (optionalFlat.isPresent()) {
            Flat flat = optionalFlat.get();
            flat.setResidentName(resident.getName());
            flat.setResidentPhone(resident.getPhone());
            flat.setResidentEmail(resident.getEmail());
            flat.setOwnershipType(resident.getOwnership());
            flatRepository.save(flat);
        }

        return residentRepository.save(resident);
    }

    @Transactional
    public void deleteResident(String id) {
        Resident resident = getResidentById(id);
        // Clear flat resident details
        String societyId = resident.getSocietyId() != null ? resident.getSocietyId() : SecurityUtils.getCurrentSocietyId();
        Optional<Flat> optionalFlat = flatRepository.findBySocietyIdAndFlatNumber(societyId, resident.getFlatNumber())
                .or(() -> flatRepository.findByFlatNumber(resident.getFlatNumber()));

        if (optionalFlat.isPresent()) {
            Flat flat = optionalFlat.get();
            flat.setOccupancyStatus("Vacant");
            flat.setOwnershipType("Vacant");
            flat.setResidentName(null);
            flat.setResidentPhone(null);
            flat.setResidentEmail(null);
            flatRepository.save(flat);
        }
        residentRepository.delete(resident);
    }
}
