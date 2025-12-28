package com.assignment.courseManagementSystem.entities;


import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String studentNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Enrollment> enrollments;

    // Getters & Setters



    // ================= Getters & Setters =================

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public java.util.List<Enrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(java.util.List<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }
}
