package com.assignment.courseManagementSystem.controllers;

import com.assignment.courseManagementSystem.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final InstructorRepository instructorRepository; // Assuming you have this

    public AdminController(CourseRepository courseRepository,
                           StudentRepository studentRepository,
                           EnrollmentRepository enrollmentRepository,
                           InstructorRepository instructorRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.instructorRepository = instructorRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("courses", courseRepository.count());
        stats.put("students", studentRepository.count());
        stats.put("instructors", instructorRepository.count());
        stats.put("enrollments", enrollmentRepository.count());
        return ResponseEntity.ok(stats);
    }
}
