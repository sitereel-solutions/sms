package com.society.management.repository;

import com.society.management.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, String> {

    List<Notice> findBySocietyIdOrderByIsPinnedDescPublishDateDesc(String societyId);

    List<Notice> findBySocietyIdAndCategory(String societyId, String category);

    List<Notice> findBySocietyIdAndPriority(String societyId, String priority);

    List<Notice> findBySocietyIdAndIsPinnedTrue(String societyId);

    List<Notice> findByCategory(String category);

    List<Notice> findByPriority(String priority);

    List<Notice> findByIsPinnedTrue();

    List<Notice> findAllByOrderByIsPinnedDescPublishDateDesc();
}
