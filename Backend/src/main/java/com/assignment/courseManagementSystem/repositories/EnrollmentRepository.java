package com.assignment.courseManagementSystem.repositories;

import com.assignment.courseManagementSystem.entities.Enrollment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Page<Enrollment> findByStatusContainingIgnoreCase(
            String status,
            Pageable pageable
    );

    // Filters enrollments specifically for the logged-in student
    List<Enrollment> findByStudentFullName(String fullName);

    List<Enrollment> findByCourseInstructorFullName(String fullName);

}