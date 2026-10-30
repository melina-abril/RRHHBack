package com.techforb.rrhh.modules.workmovements.api;

import com.techforb.rrhh.modules.workmovements.application.ChangeCategoryRequest;
import com.techforb.rrhh.modules.workmovements.application.EgressRequest;
import com.techforb.rrhh.modules.workmovements.application.ReentryRequest;
import com.techforb.rrhh.modules.workmovements.application.WorkMovementDto;
import com.techforb.rrhh.modules.workmovements.application.WorkMovementsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/work-movements")
@PreAuthorize("hasRole('ADMIN_RRHH')")
public class WorkMovementsController {

    private final WorkMovementsService workMovementsService;

    public WorkMovementsController(WorkMovementsService workMovementsService) {
        this.workMovementsService = workMovementsService;
    }

    @PostMapping("/{legajo}/change-category")
    public ResponseEntity<WorkMovementDto> changeCategory(
            @PathVariable String legajo,
            @RequestBody ChangeCategoryRequest request) {
        // Dummy response, to be replaced with actual implementation
        WorkMovementDto result = workMovementsService.changeCategory(legajo, request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{legajo}/egress")
    public ResponseEntity<WorkMovementDto> registerEgress(
            @PathVariable String legajo,
            @RequestBody EgressRequest request) {
        // Dummy response, to be replaced with actual implementation
        WorkMovementDto result = workMovementsService.registerEgress(legajo, request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{legajo}/reentry")
    public ResponseEntity<WorkMovementDto> registerReentry(
            @PathVariable String legajo,
            @RequestBody ReentryRequest request) {
        // Dummy response, to be replaced with actual implementation
        WorkMovementDto result = workMovementsService.registerReentry(legajo, request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{legajo}/history")
    public ResponseEntity<List<WorkMovementDto>> getWorkMovementsHistory(@PathVariable String legajo) {
        // Dummy response, to be replaced with actual implementation
        List<WorkMovementDto> result = workMovementsService.getWorkMovementsHistory(legajo);
        return ResponseEntity.ok(result);
    }
}
