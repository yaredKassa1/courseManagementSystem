package com.assignment.courseManagementSystem.auths;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAll();
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @PatchMapping("/{id}/activate")
    public void activate(@PathVariable Long id) {
        userService.setActive(id, true);
    }

    @PatchMapping("/{id}/deactivate")
    public void deactivate(@PathVariable Long id) {
        userService.setActive(id, false);
    }

    @PatchMapping("/{id}/reset-password")
    public void resetPassword(@PathVariable Long id) {
        userService.resetPassword(id);
    }

    @PatchMapping("/{id}/role")
    public void changeRole(@PathVariable Long id, @RequestBody RoleRequest req) {
        userService.changeRole(id, req.getRole());
    }
}