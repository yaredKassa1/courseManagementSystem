package com.assignment.courseManagementSystem.services.contract;

import com.assignment.courseManagementSystem.dto.StudentDto;
import org.springframework.data.domain.Page;

public interface StudentService {

    StudentDto createStudent(StudentDto dto);

    StudentDto getStudentById(Long id);

    Page<StudentDto> getStudents(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    StudentDto updateStudent(Long id, StudentDto dto);

    void deleteStudent(Long id);
}


