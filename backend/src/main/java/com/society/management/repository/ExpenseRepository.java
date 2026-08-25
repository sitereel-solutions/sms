package com.society.management.repository;

import com.society.management.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, String> {

    List<Expense> findBySocietyId(String societyId);

    List<Expense> findBySocietyIdAndCategory(String societyId, String category);

    List<Expense> findBySocietyIdAndStatus(String societyId, String status);

    List<Expense> findByCategory(String category);

    List<Expense> findByStatus(String status);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.societyId = :societyId AND e.status = 'Paid'")
    Double sumTotalExpensesBySocietyId(@Param("societyId") String societyId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.status = 'Paid'")
    Double sumTotalExpenses();

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.societyId = :societyId AND e.status = 'Paid' GROUP BY e.category")
    List<Object[]> sumExpensesByCategoryAndSocietyId(@Param("societyId") String societyId);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.status = 'Paid' GROUP BY e.category")
    List<Object[]> sumExpensesByCategory();
}
