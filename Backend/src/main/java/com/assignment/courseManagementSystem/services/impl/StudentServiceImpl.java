package com.assignment.courseManagementSystem.services.impl;

import com.assignment.courseManagementSystem.dto.StudentDto;
import com.assignment.courseManagementSystem.entities.Enrollment;
import com.assignment.courseManagementSystem.entities.Student;
import com.assignment.courseManagementSystem.exception.ResourceNotFoundException;
import com.assignment.courseManagementSystem.repositories.StudentRepository;
import com.assignment.courseManagementSystem.services.contract.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public StudentDto createStudent(StudentDto dto) {

        Student student = new Student();
        student.setFullName(dto.getFullName());
        student.setStudentNumber(dto.getStudentNumber());
        student.setEmail(dto.getEmail());

        studentRepository.save(student);
        dto.setStudentId(student.getStudentId());
        return dto;
    }

    @Override
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return mapToDto(student);
    }

    @Override
    public Page<StudentDto> getStudents(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Student> pageResult =
                (search != null && !search.isEmpty())
                        ? studentRepository.findByFullNameContainingIgnoreCase(search, pageable)
                        : studentRepository.findAll(pageable);

        return pageResult.map(this::mapToDto);
    }

    @Override
    public StudentDto updateStudent(Long id, StudentDto dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        student.setFullName(dto.getFullName());
        student.setStudentNumber(dto.getStudentNumber());
        student.setEmail(dto.getEmail());

        studentRepository.save(student);
        return mapToDto(student);
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    private StudentDto mapToDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setStudentId(student.getStudentId());
        dto.setFullName(student.getFullName());
        dto.setStudentNumber(student.getStudentNumber());
        dto.setEmail(student.getEmail());

        if (student.getEnrollments() != null) {
            dto.setEnrollmentIds(
                    student.getEnrollments()
                            .stream()
                            .map(Enrollment::getEnrollmentId)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
