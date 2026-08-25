package com.society.management.repository;

import com.society.management.entity.ActivityItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<ActivityItem, String> {

    List<ActivityItem> findTop50BySocietyIdOrderByTimestampDesc(String societyId);

    List<ActivityItem> findTop50ByOrderByTimestampDesc();
}
