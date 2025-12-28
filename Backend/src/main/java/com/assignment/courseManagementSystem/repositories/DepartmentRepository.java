package com.assignment.courseManagementSystem.repositories;


import com.assignment.courseManagementSystem.entities.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Page<Department> findByDepartmentNameContainingIgnoreCase(String keyword, Pageable pageable);
}


