package com.assignment.courseManagementSystem.services.impl;

import com.assignment.courseManagementSystem.dto.InstructorDto;
import com.assignment.courseManagementSystem.entities.Course;
import com.assignment.courseManagementSystem.entities.Department;
import com.assignment.courseManagementSystem.entities.Instructor;
import com.assignment.courseManagementSystem.exception.ResourceNotFoundException;
import com.assignment.courseManagementSystem.repositories.DepartmentRepository;
import com.assignment.courseManagementSystem.repositories.InstructorRepository;
import com.assignment.courseManagementSystem.services.contract.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public InstructorDto createInstructor(InstructorDto dto) {

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Instructor instructor = new Instructor();
        instructor.setFullName(dto.getFullName());
        instructor.setEmail(dto.getEmail());
        instructor.setPhoneNumber(dto.getPhoneNumber());
        instructor.setSpecialization(dto.getSpecialization());
        instructor.setDepartment(department);

        instructorRepository.save(instructor);
        dto.setInstructorId(instructor.getInstructorId());
        return dto;
    }

    @Override
    public InstructorDto getInstructorById(Long id) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        return mapToDto(instructor);
    }

    @Override
    public Page<InstructorDto> getInstructors(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Instructor> pageResult =
                (search != null && !search.isEmpty())
                        ? instructorRepository.findByFullNameContainingIgnoreCase(search, pageable)
                        : instructorRepository.findAll(pageable);

        return pageResult.map(this::mapToDto);
    }

    @Override
    public InstructorDto updateInstructor(Long id, InstructorDto dto) {

        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        instructor.setFullName(dto.getFullName());
        instructor.setEmail(dto.getEmail());
        instructor.setPhoneNumber(dto.getPhoneNumber());
        instructor.setSpecialization(dto.getSpecialization());
        instructor.setDepartment(department);

        instructorRepository.save(instructor);
        return mapToDto(instructor);
    }

    @Override
    public void deleteInstructor(Long id) {
        instructorRepository.deleteById(id);
    }

    private InstructorDto mapToDto(Instructor instructor) {
        InstructorDto dto = new InstructorDto();
        dto.setInstructorId(instructor.getInstructorId());
        dto.setFullName(instructor.getFullName());
        dto.setEmail(instructor.getEmail());
        dto.setPhoneNumber(instructor.getPhoneNumber());
        dto.setSpecialization(instructor.getSpecialization());
        dto.setDepartmentId(instructor.getDepartment().getDepartmentId());

        if (instructor.getCourses() != null) {
            dto.setCourseIds(
                    instructor.getCourses()
                            .stream()
                            .map(Course::getCourseId)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
