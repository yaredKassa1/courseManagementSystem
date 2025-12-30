package com.assignment.courseManagementSystem.services.contract;

import com.assignment.courseManagementSystem.dto.EnrollmentDto;
import com.assignment.courseManagementSystem.entities.Course;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EnrollmentService {

    EnrollmentDto createEnrollment(EnrollmentDto dto);


    EnrollmentDto getEnrollmentById(Long id);

    Page<EnrollmentDto> getEnrollments(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    EnrollmentDto updateEnrollment(Long id, EnrollmentDto dto);

    void deleteEnrollment(Long id);
}


