package com.assignment.courseManagementSystem.services.contract;

import com.assignment.courseManagementSystem.dto.DepartmentDto;
import org.springframework.data.domain.Page;

public interface DepartmentService {

    DepartmentDto createDepartment(DepartmentDto dto);

    DepartmentDto getDepartmentById(Long id);

    Page<DepartmentDto> getDepartments(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    DepartmentDto updateDepartment(Long id, DepartmentDto dto);

    void deleteDepartment(Long id);
}

