package com.assignment.courseManagementSystem.services.contract;


import com.assignment.courseManagementSystem.dto.InstructorDto;
import org.springframework.data.domain.Page;

public interface InstructorService {

    InstructorDto createInstructor(InstructorDto dto);

    InstructorDto getInstructorById(Long id);

    Page<InstructorDto> getInstructors(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    InstructorDto updateInstructor(Long id, InstructorDto dto);

    void deleteInstructor(Long id);
}

