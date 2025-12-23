package com.assignment.courseManagementSystem.repositories;


import com.assignment.courseManagementSystem.entities.Instructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {


    Page<Instructor> findByFullNameContainingIgnoreCase(String keyword, Pageable pageable);
}

