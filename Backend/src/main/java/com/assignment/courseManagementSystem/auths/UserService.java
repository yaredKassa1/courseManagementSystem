package com.assignment.courseManagementSystem.auths;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Registration
    public User register(RegisterRequestDto req) {
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("ROLE_USER");
        user.setEnabled(false); // inactive until admin activates
        return userRepository.save(user);
    }

    // Admin operations
    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true); // default active when created by admin
        return userRepository.save(user);
    }

    public User update(Long id, User data) {
        User user = userRepository.findById(id).orElseThrow();
        user.setUsername(data.getUsername());
        if (data.getPassword() != null && !data.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(data.getPassword()));
        }
        user.setRole(data.getRole());
        return userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public void setActive(Long id, boolean active) {
        User user = userRepository.findById(id).orElseThrow();
        user.setEnabled(active);
        userRepository.save(user);
    }

    public void resetPassword(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(user);
    }

    public void changeRole(Long id, String role) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(role);
        userRepository.save(user);
    }
}