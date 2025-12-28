package com.assignment.courseManagementSystem.repositories;


import com.assignment.courseManagementSystem.entities.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Page<Student> findByFullNameContainingIgnoreCase(String keyword, Pageable pageable);
}
