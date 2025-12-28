package com.assignment.courseManagementSystem.services.impl;

import com.assignment.courseManagementSystem.dto.CourseDto;
import com.assignment.courseManagementSystem.entities.Course;
import com.assignment.courseManagementSystem.entities.Department;
import com.assignment.courseManagementSystem.entities.Instructor;
import com.assignment.courseManagementSystem.exception.ResourceNotFoundException;
import com.assignment.courseManagementSystem.repositories.CourseRepository;
import com.assignment.courseManagementSystem.repositories.DepartmentRepository;
import com.assignment.courseManagementSystem.repositories.InstructorRepository;
import com.assignment.courseManagementSystem.services.contract.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final InstructorRepository instructorRepository;

    @Override
    public CourseDto createCourse(CourseDto dto) {

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Instructor instructor = instructorRepository.findById(dto.getInstructorId())
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        Course course = new Course();
        course.setCourseName(dto.getCourseName());
        course.setCourseCode(dto.getCourseCode());
        course.setDescription(dto.getDescription());
        course.setCredits(dto.getCredits());
        course.setSemester(dto.getSemester());
        course.setDepartment(department);
        course.setInstructor(instructor);

        courseRepository.save(course);
        dto.setCourseId(course.getCourseId());
        return dto;
    }

    @Override
    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        return mapToDto(course);
    }

    @Override
    public Page<CourseDto> getCourses(
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Course> pageResult =
                (search != null && !search.isEmpty())
                        ? courseRepository.findByCourseNameContainingIgnoreCase(search, pageable)
                        : courseRepository.findAll(pageable);

        return pageResult.map(this::mapToDto);
    }

    @Override
    public CourseDto updateCourse(Long id, CourseDto dto) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Instructor instructor = instructorRepository.findById(dto.getInstructorId())
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        course.setCourseName(dto.getCourseName());
        course.setCourseCode(dto.getCourseCode());
        course.setDescription(dto.getDescription());
        course.setCredits(dto.getCredits());
        course.setSemester(dto.getSemester());
        course.setDepartment(department);
        course.setInstructor(instructor);

        courseRepository.save(course);
        return mapToDto(course);
    }

    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    private CourseDto mapToDto(Course course) {
        CourseDto dto = new CourseDto();
        dto.setCourseId(course.getCourseId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseCode(course.getCourseCode());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        dto.setSemester(course.getSemester());
        dto.setDepartmentId(course.getDepartment().getDepartmentId());
        dto.setDepartmentName(course.getDepartment().getDepartmentName());
        dto.setInstructorName(course.getInstructor().getFullName());
        dto.setInstructorId(course.getInstructor().getInstructorId());
        return dto;
    }
}
