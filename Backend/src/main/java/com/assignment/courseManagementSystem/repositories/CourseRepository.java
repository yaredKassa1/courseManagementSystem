package com.assignment.courseManagementSystem.repositories;


import com.assignment.courseManagementSystem.entities.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CourseRepository extends JpaRepository<Course, Long> {

    Page<Course> findByCourseNameContainingIgnoreCase(String keyword, Pageable pageable);
    List<Course> findByInstructorFullName(String fullName);
}

