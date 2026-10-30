package com.techforb.rrhh.modules.employee_technical_profile.api;

import com.techforb.rrhh.modules.employee_technical_profile.application.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee-technical-profile")
public class EmployeeTechnicalProfileController {
    private final EmployeeTechnicalProfileService profileService;

    public EmployeeTechnicalProfileController(EmployeeTechnicalProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * GET /api/employee-technical-profile/{legajo}
     * Devuelve el perfil técnico (tecnologías, experiencia, certificaciones) y documentación cargada.
     */
    @GetMapping("/{legajo}")
    public ResponseEntity<EmployeeTechnicalProfileDto> getProfile(
            @PathVariable String legajo
    ) {
        return ResponseEntity.ok(profileService.getTechnicalProfile(legajo));
    }

    /**
     * POST /api/employee-technical-profile/{legajo}/skills
     * Agrega o actualiza habilidades, conocimientos y tecnologías del colaborador.
     */
    @PostMapping("/{legajo}/skills")
    public ResponseEntity<EmployeeTechnicalProfileDto> updateSkills(
            @PathVariable String legajo,
            @Valid @RequestBody UpdateSkillsRequest skillsRequest
    ) {
        return ResponseEntity.ok(profileService.updateSkills(legajo, skillsRequest));
    }

    /**
     * POST /api/employee-technical-profile/{legajo}/certifications
     * Carga una certificación o actualización de certificación registrada.
     */
    @PostMapping("/{legajo}/certifications")
    public ResponseEntity<EmployeeTechnicalProfileDto> addCertification(
            @PathVariable String legajo,
            @Valid @RequestBody AddCertificationRequest certificationRequest
    ) {
        return ResponseEntity.ok(profileService.addCertification(legajo, certificationRequest));
    }

    /**
     * POST /api/employee-technical-profile/{legajo}/documents
     * Sube un documento con título y categoría y lo vincula al legajo.
     */
    @PostMapping("/{legajo}/documents")
    public ResponseEntity<EmployeeTechnicalProfileDto> uploadDocument(
            @PathVariable String legajo,
            @Valid @RequestBody UploadDocumentRequest documentRequest
    ) {
        return ResponseEntity.ok(profileService.uploadDocument(legajo, documentRequest));
    }
}
