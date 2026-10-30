package com.techforb.rrhh.modules.projectsassignments.api;

import com.techforb.rrhh.modules.projectsassignments.application.AssignmentDto;
import com.techforb.rrhh.modules.projectsassignments.application.AssignmentRequest;
import com.techforb.rrhh.modules.projectsassignments.application.ClientDto;
import com.techforb.rrhh.modules.projectsassignments.application.ProjectAssignmentService;
import com.techforb.rrhh.shared.domain.PageResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects-assignments")
@PreAuthorize("hasRole('ADMIN_RRHH')")
public class ProjectsAssignmentsController {

    private final ProjectAssignmentService service;

    public ProjectsAssignmentsController(ProjectAssignmentService service) {
        this.service = service;
    }

    /**
     * GET /api/projects-assignments/clients
     */
    @GetMapping("/clients")
    public ResponseEntity<List<ClientDto>> getClients() {
        List<ClientDto> clients = service.getClients();
        return ResponseEntity.ok(clients);
    }

    /**
     * GET /api/projects-assignments/{legajo}/assignments
     */
    @GetMapping("/{legajo}/assignments")
    public ResponseEntity<List<AssignmentDto>> getAssignmentsByLegajo(@PathVariable String legajo) {
        List<AssignmentDto> assignments = service.getAssignmentsByLegajo(legajo);
        return ResponseEntity.ok(assignments);
    }

    /**
     * POST /api/projects-assignments/{legajo}/assignments
     */
    @PostMapping("/{legajo}/assignments")
    public ResponseEntity<AssignmentDto> createAssignment(
            @PathVariable String legajo,
            @Valid @RequestBody AssignmentRequest request
    ) {
        AssignmentDto dto = service.createAssignment(legajo, request);
        return ResponseEntity.ok(dto);
    }

    /**
     * PUT /api/projects-assignments/{legajo}/assignments/{assignmentId}
     */
    @PutMapping("/{legajo}/assignments/{assignmentId}")
    public ResponseEntity<AssignmentDto> editAssignment(
            @PathVariable String legajo,
            @PathVariable String assignmentId,
            @Valid @RequestBody AssignmentRequest request
    ) {
        AssignmentDto dto = service.editAssignment(legajo, assignmentId, request);
        return ResponseEntity.ok(dto);
    }

    /**
     * POST /api/projects-assignments/{legajo}/assignments/{assignmentId}/finalize
     */
    @PostMapping("/{legajo}/assignments/{assignmentId}/finalize")
    public ResponseEntity<AssignmentDto> finalizeAssignment(
            @PathVariable String legajo,
            @PathVariable String assignmentId,
            @RequestParam(name = "endDate") String endDate // ISO date string
    ) {
        AssignmentDto dto = service.finalizeAssignment(legajo, assignmentId, endDate);
        return ResponseEntity.ok(dto);
    }
}
