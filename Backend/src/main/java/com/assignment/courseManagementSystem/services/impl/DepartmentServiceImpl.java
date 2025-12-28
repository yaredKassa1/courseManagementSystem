package com.assignment.courseManagementSystem.services.impl;


import com.assignment.courseManagementSystem.dto.DepartmentDto;
import com.assignment.courseManagementSystem.entities.Course;
import com.assignment.courseManagementSystem.entities.Department;
import com.assignment.courseManagementSystem.entities.Instructor;
import com.assignment.courseManagementSystem.exception.ResourceNotFoundException;
import com.assignment.courseManagementSystem.repositories.DepartmentRepository;
import com.assignment.courseManagementSystem.services.contract.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {

        Department department = new Department();
        department.setDepartmentName(dto.getDepartmentName());
        department.setDepartmentCode(dto.getDepartmentCode());
        department.setDescription(dto.getDescription());

        departmentRepository.save(department);
        dto.setDepartmentId(department.getDepartmentId());
        return dto;
    }

    @Override
    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        return mapToDto(department);
    }

    @Override
    public Page<DepartmentDto> getDepartments(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Department> pageResult =
                (search != null && !search.isEmpty())
                        ? departmentRepository
                        .findByDepartmentNameContainingIgnoreCase(search, pageable)
                        : departmentRepository.findAll(pageable);

        return pageResult.map(this::mapToDto);
    }

    @Override
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        department.setDepartmentName(dto.getDepartmentName());
        department.setDepartmentCode(dto.getDepartmentCode());
        department.setDescription(dto.getDescription());

        departmentRepository.save(department);
        return mapToDto(department);
    }

    @Override
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    private DepartmentDto mapToDto(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setDepartmentId(department.getDepartmentId());
        dto.setDepartmentName(department.getDepartmentName());
        dto.setDepartmentCode(department.getDepartmentCode());
        dto.setDescription(department.getDescription());

        if (department.getCourses() != null) {
            dto.setCourseIds(
                    department.getCourses()
                            .stream()
                            .map(Course::getCourseId)
                            .collect(Collectors.toList())
            );
        }

        if (department.getInstructors() != null) {
            dto.setInstructorIds(
                    department.getInstructors()
                            .stream()
                            .map(Instructor::getInstructorId)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
