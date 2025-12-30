package com.assignment.courseManagementSystem.controllers;

import com.assignment.courseManagementSystem.entities.Course;
import com.assignment.courseManagementSystem.entities.Enrollment;
import com.assignment.courseManagementSystem.repositories.CourseRepository;
import com.assignment.courseManagementSystem.repositories.EnrollmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instructor")
@PreAuthorize("hasRole('USER')")
public class InstructorDataController {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public InstructorDataController(CourseRepository courseRepository, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * GET /api/instructor/dashboard-stats
     * Returns live counts for the dashboard widgets
     */
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Principal principal) {
        String instructorName = principal.getName();

        // Count courses owned by instructor
        int courseCount = courseRepository.findByInstructorFullName(instructorName).size();

        // Count enrollments in those courses using the new repository method
        int studentCount = enrollmentRepository.findByCourseInstructorFullName(instructorName).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeCourses", courseCount);
        stats.put("totalStudents", studentCount);
        stats.put("pendingSubmissions", 0); // Placeholder

        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/instructor/my-courses
     * Returns list of courses the instructor is teaching
     */
    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyCourses(Principal principal) {
        return ResponseEntity.ok(courseRepository.findByInstructorFullName(principal.getName()));
    }

    /**
     * GET /api/instructor/my-students
     * Returns students enrolled in the instructor's classes
     */
    @GetMapping("/my-students")
    public ResponseEntity<List<Map<String, Object>>> getMyStudents(Principal principal) {
        String instructorName = principal.getName();

        // Optimized: fetching only relevant enrollments from DB
        List<Enrollment> enrollments = enrollmentRepository.findByCourseInstructorFullName(instructorName);

        List<Map<String, Object>> response = enrollments.stream().map(en -> {
            Map<String, Object> map = new HashMap<>();
            map.put("enrollmentId", en.getEnrollmentId());
            map.put("studentName", en.getStudent().getFullName());
            map.put("courseName", en.getCourse().getCourseName());
            map.put("enrollmentDate", en.getEnrollmentDate());
            map.put("status", en.getStatus());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
