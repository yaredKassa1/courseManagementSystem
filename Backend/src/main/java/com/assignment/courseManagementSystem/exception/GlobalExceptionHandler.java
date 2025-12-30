package com.assignment.courseManagementSystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleConflict(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "This record cannot be deleted because it is referenced by other data (Enrollments).");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}
