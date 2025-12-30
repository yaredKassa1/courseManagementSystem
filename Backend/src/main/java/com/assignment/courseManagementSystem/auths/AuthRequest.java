package com.assignment.courseManagementSystem.auths;

import lombok.AllArgsConstructor;
import lombok.Data;


class AuthRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}





class AuthResponse {
    private String token;
    private String role;
    private String dashboardType;
    private String username;


    public AuthResponse(String token, String role,String dashboardType, String username) {
        this.token = token;
        this.role = role;
        this.username = username;
        this.dashboardType = dashboardType;
    }

    public String getDashboardType() {
        return dashboardType;
    }

    public String getToken() {
        return token;
    }
    public String getRole() {
        return role;
    }
    public String getUsername() {
        return username;
    }
}
