package com.assignment.courseManagementSystem.repositories;

import com.assignment.courseManagementSystem.entities.Enrollment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Page<Enrollment> findByStatusContainingIgnoreCase(
            String status,
            Pageable pageable
    );
}
