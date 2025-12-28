package com.assignment.courseManagementSystem.dto;



import java.util.List;

public class StudentDto {

    private Long studentId;
    private String fullName;
    private String studentNumber;
    private String email;

    // Relationship as IDs
    private List<Long> enrollmentIds;

    // Getters & Setters

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Long> getEnrollmentIds() {
        return enrollmentIds;
    }

    public void setEnrollmentIds(List<Long> enrollmentIds) {
        this.enrollmentIds = enrollmentIds;
    }
}

