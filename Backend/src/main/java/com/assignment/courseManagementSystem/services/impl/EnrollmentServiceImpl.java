package com.assignment.courseManagementSystem.services.impl;

import com.assignment.courseManagementSystem.dto.EnrollmentDto;
import com.assignment.courseManagementSystem.entities.Course;
import com.assignment.courseManagementSystem.entities.Enrollment;
import com.assignment.courseManagementSystem.entities.Student;
import com.assignment.courseManagementSystem.exception.ResourceNotFoundException;
import com.assignment.courseManagementSystem.repositories.CourseRepository;
import com.assignment.courseManagementSystem.repositories.EnrollmentRepository;
import com.assignment.courseManagementSystem.repositories.StudentRepository;
import com.assignment.courseManagementSystem.services.contract.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Override
    public EnrollmentDto createEnrollment(EnrollmentDto dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(dto.getEnrollmentDate());
        enrollment.setStatus(dto.getStatus());

        enrollmentRepository.save(enrollment);
        dto.setEnrollmentId(enrollment.getEnrollmentId());
        return dto;
    }

    @Override
    public EnrollmentDto getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        return mapToDto(enrollment);
    }

    @Override
    public Page<EnrollmentDto> getEnrollments(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Enrollment> pageResult =
                (search != null && !search.isEmpty())
                        ? enrollmentRepository.findByStatusContainingIgnoreCase(search, pageable)
                        : enrollmentRepository.findAll(pageable);

        return pageResult.map(this::mapToDto);
    }

    @Override
    public EnrollmentDto updateEnrollment(Long id, EnrollmentDto dto) {

        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        enrollment.setStatus(dto.getStatus());
        enrollment.setEnrollmentDate(dto.getEnrollmentDate());

        enrollmentRepository.save(enrollment);
        return mapToDto(enrollment);
    }

    @Override
    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }

    private EnrollmentDto mapToDto(Enrollment enrollment) {
        EnrollmentDto dto = new EnrollmentDto();
        dto.setEnrollmentId(enrollment.getEnrollmentId());
        dto.setStudentId(enrollment.getStudent().getStudentId());
        dto.setCourseId(enrollment.getCourse().getCourseId());
        dto.setEnrollmentDate(enrollment.getEnrollmentDate());
        dto.setCourseName(enrollment.getCourse().getCourseName());
        dto.setStatus(enrollment.getStatus());
        return dto;
    }
}
