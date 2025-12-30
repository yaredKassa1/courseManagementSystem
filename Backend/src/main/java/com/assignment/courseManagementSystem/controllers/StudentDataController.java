package com.assignment.courseManagementSystem.controllers;

import com.assignment.courseManagementSystem.auths.UserRepository;
import com.assignment.courseManagementSystem.entities.Course;
import com.assignment.courseManagementSystem.entities.Enrollment;
import com.assignment.courseManagementSystem.repositories.EnrollmentRepository;
import com.assignment.courseManagementSystem.repositories.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentDataController {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    private final UserRepository userRepository; // Add this
    private final PasswordEncoder passwordEncoder; // Add this

    // Update constructor to include these
    public StudentDataController(EnrollmentRepository enrollmentRepository,
                                 StudentRepository studentRepository,
                                 UserRepository userRepository,
                                 PasswordEncoder passwordEncoder) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /api/student/my-courses
    @GetMapping("/my-courses")
    public ResponseEntity<?> getMyEnrolledCourses(Principal principal) {
        String fullName = principal.getName();
        // Finds enrollments for this specific name
        List<Enrollment> enrollments = enrollmentRepository.findByStudentFullName(fullName);

        // Extract the Course objects from those enrollments
        List<Course> myCourses = enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(myCourses);
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Map<String, Object>>> getMyEnrollments(Principal principal) {
        String username = principal.getName();

        // We find all enrollments where the associated student's name matches the logged-in user
        List<Enrollment> enrollments = enrollmentRepository.findByStudentFullName(username);

        List<Map<String, Object>> response = enrollments.stream().map(en -> {
            Map<String, Object> map = new HashMap<>();
            map.put("enrollmentId", en.getEnrollmentId());
            map.put("courseName", en.getCourse().getCourseName());
            map.put("credits", en.getCourse().getCredits());
            map.put("enrollmentDate", en.getEnrollmentDate());
            map.put("status", en.getStatus());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    //  GET /api/student/profile
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(Principal principal) {
        return studentRepository.findByFullName(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updateData, Principal principal) {
        String username = principal.getName();

        // 1. Update Student Email
        studentRepository.findByFullName(username).ifPresent(student -> {
            student.setEmail(updateData.get("email"));
            studentRepository.save(student);
        });

        // 2. Update User Password (if provided)
        String newPassword = updateData.get("password");
        if (newPassword != null && !newPassword.isEmpty()) {
            userRepository.findByUsername(username).ifPresent(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
            });
        }

        return ResponseEntity.ok("Profile and Security settings updated successfully");
    }
}