package com.techforb.rrhh.modules.employeeprofile.api;

import com.techforb.rrhh.modules.employeeprofile.application.EmployeeProfileDto;
import com.techforb.rrhh.modules.employeeprofile.application.EmployeeProfileService;
import com.techforb.rrhh.shared.security.Roles;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee-profile")
public class EmployeeProfileController {

    private final EmployeeProfileService employeeProfileService;

    public EmployeeProfileController(EmployeeProfileService employeeProfileService) {
        this.employeeProfileService = employeeProfileService;
    }

    // GET /api/employee-profile/{legajo} - ficha individual del colaborador
    @GetMapping("/{legajo}")
    @PreAuthorize("hasRole('" + Roles.ADMIN_RRHH + "')")
    public ResponseEntity<EmployeeProfileDto> getEmployeeProfile(@PathVariable("legajo") String legajo) {
        EmployeeProfileDto profile = employeeProfileService.getEmployeeProfile(legajo);
        return ResponseEntity.ok(profile);
    }
}
