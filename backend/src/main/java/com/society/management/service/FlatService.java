package com.society.management.service;

import com.society.management.entity.Flat;
import com.society.management.exception.ResourceNotFoundException;
import com.society.management.repository.FlatRepository;
import com.society.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlatService {

    private final FlatRepository flatRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public List<Flat> getAllFlats() {
        if (SecurityUtils.isSuperAdmin()) {
            return flatRepository.findAll();
        }
        String societyId = SecurityUtils.getCurrentSocietyId();
        return flatRepository.findBySocietyId(societyId);
    }

    @Transactional(readOnly = true)
    public Flat getFlatById(String id) {
        return flatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Flat getFlatByFlatNumber(String flatNumber) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return flatRepository.findBySocietyIdAndFlatNumber(societyId, flatNumber)
                .or(() -> flatRepository.findByFlatNumber(flatNumber))
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found with flat number: " + flatNumber));
    }

    @Transactional(readOnly = true)
    public List<Flat> getFlatsByBlock(String block) {
        String societyId = SecurityUtils.getCurrentSocietyId();
        return flatRepository.findBySocietyIdAndBlock(societyId, block);
    }

    @Transactional
    public Flat createFlat(Flat flat) {
        if (flat.getSocietyId() == null || flat.getSocietyId().isBlank()) {
            flat.setSocietyId(SecurityUtils.getCurrentSocietyId());
        }
        if (flat.getId() == null || flat.getId().isBlank()) {
            flat.setId("flat-" + (flat.getSocietyId() != null ? flat.getSocietyId() + "-" : "") + flat.getFlatNumber());
        }
        Flat saved = flatRepository.save(flat);
        activityService.logActivity(
                "Flat " + flat.getFlatNumber() + " registered",
                "Block " + flat.getBlock() + " · Floor " + flat.getFloor() + " (" + flat.getBhk() + ")",
                "resident",
                "text-blue-600 bg-blue-100"
        );
        return saved;
    }

    @Transactional
    public Flat updateFlat(String id, Flat flatDetails) {
        Flat flat = getFlatById(id);
        flat.setOccupancyStatus(flatDetails.getOccupancyStatus());
        flat.setOwnershipType(flatDetails.getOwnershipType());
        flat.setResidentName(flatDetails.getResidentName());
        flat.setResidentPhone(flatDetails.getResidentPhone());
        flat.setResidentEmail(flatDetails.getResidentEmail());
        flat.setMonthlyMaintenance(flatDetails.getMonthlyMaintenance());
        flat.setMaintenanceStatus(flatDetails.getMaintenanceStatus());
        flat.setParkingSlot(flatDetails.getParkingSlot());
        flat.setElectricityMeter(flatDetails.getElectricityMeter());
        flat.setGasMeter(flatDetails.getGasMeter());
        return flatRepository.save(flat);
    }

    @Transactional
    public void deleteFlat(String id) {
        Flat flat = getFlatById(id);
        flatRepository.delete(flat);
    }
}
