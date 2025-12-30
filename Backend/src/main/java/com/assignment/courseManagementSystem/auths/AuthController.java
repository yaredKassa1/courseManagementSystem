package com.assignment.courseManagementSystem.auths;

import com.assignment.courseManagementSystem.repositories.StudentRepository;
import com.assignment.courseManagementSystem.repositories.InstructorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          StudentRepository studentRepository,
                          InstructorRepository instructorRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.instructorRepository = instructorRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Authenticate credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            return ResponseEntity.status(403).body("User is inactive. Contact admin.");
        }

        String dashboardType = "UNKNOWN";

        // Logic: Redirect based on Role and Name Mapping
        if ("ROLE_ADMIN".equals(user.getRole())) {
            dashboardType = "ADMIN_DASHBOARD";
        } else {
            // Check if this username exists as a Student or Instructor name
            boolean isStudent = studentRepository.findByFullName(user.getUsername()).isPresent();
            boolean isInstructor = instructorRepository.findByFullName(user.getUsername()).isPresent();

            if (isStudent) {
                dashboardType = "STUDENT_DASHBOARD";
            } else if (isInstructor) {
                dashboardType = "INSTRUCTOR_DASHBOARD";
            }
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // Return token AND dashboardType to Next.js
        return ResponseEntity.ok(new AuthResponse(token, user.getRole(), dashboardType, user.getUsername()));
    }
}