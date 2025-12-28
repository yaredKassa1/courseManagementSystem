package com.assignment.courseManagementSystem.services.contract;

import com.assignment.courseManagementSystem.dto.CourseDto;
import org.springframework.data.domain.Page;

public interface CourseService {

    CourseDto createCourse(CourseDto dto);

    CourseDto getCourseById(Long id);

    Page<CourseDto> getCourses(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    CourseDto updateCourse(Long id, CourseDto dto);

    void deleteCourse(Long id);
}
