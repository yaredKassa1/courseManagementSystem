package com.assignment.courseManagementSystem.controllers;

import com.assignment.courseManagementSystem.dto.EnrollmentDto;
import com.assignment.courseManagementSystem.services.contract.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<EnrollmentDto> create(@RequestBody EnrollmentDto dto) {
        return ResponseEntity.ok(enrollmentService.createEnrollment(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentById(id));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getEnrollments(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "enrollmentDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Page<EnrollmentDto> result =
                enrollmentService.getEnrollments(search, page, size, sortBy, sortDir);

        Map<String, Object> response = new HashMap<>();
        response.put("data", result.getContent());
        response.put("totalItems", result.getTotalElements());
        response.put("totalPages", result.getTotalPages());
        response.put("currentPage", result.getNumber());

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentDto> update(
            @PathVariable Long id,
            @RequestBody EnrollmentDto dto) {
        return ResponseEntity.ok(enrollmentService.updateEnrollment(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
