package com.techforb.rrhh.modules.employee_technical_profile.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeTechnicalProfileService {
    public EmployeeTechnicalProfileDto getTechnicalProfile(String legajo) {
        // Dummy: Devuelve datos ficticios de perfil técnico y documentación
        return new EmployeeTechnicalProfileDto(
            legajo,
            new SkillsDto(
                java.util.List.of("Java", "Spring Boot", "SQL"),
                java.util.List.of("Git", "Docker"),
                5
            ),
            java.util.List.of(
                new CertificationDto("Oracle Java SE 11", "Oracle", "2020-05-12", "123456"),
                new CertificationDto("Scrum Master", "Scrum.org", "2019-11-19", "SM01234")
            ),
            java.util.List.of(
                new DocumentDto("Certificado de Título Universitario", "Educación", "universitario_ana.pdf", "2021-06-14"),
                new DocumentDto("CV actualizado", "Currículum", "cv_ana.pdf", "2024-01-10")
            )
        );
    }

    @Transactional
    public EmployeeTechnicalProfileDto updateSkills(String legajo, UpdateSkillsRequest request) {
        // Dummy: Aplica las skills al perfil y responde los datos actualizados
        return new EmployeeTechnicalProfileDto(
            legajo,
            new SkillsDto(
                request.technologies(),
                request.tools(),
                request.yearsExperience()
            ),
            java.util.List.of(
                new CertificationDto("Oracle Java SE 11", "Oracle", "2020-05-12", "123456")
            ),
            java.util.List.of()
        );
    }

    @Transactional
    public EmployeeTechnicalProfileDto addCertification(String legajo, AddCertificationRequest request) {
        // Dummy: Añade la certificación y responde perfil actualizado
        return new EmployeeTechnicalProfileDto(
            legajo,
            new SkillsDto(
                java.util.List.of("Java", "Spring Boot"),
                java.util.List.of("Git"),
                5
            ),
            java.util.List.of(
                new CertificationDto(
                    request.title(),
                    request.issuer(),
                    request.issueDate(),
                    request.certificateId() != null ? request.certificateId() : ""
                )
            ),
            java.util.List.of()
        );
    }

    @Transactional
    public EmployeeTechnicalProfileDto uploadDocument(String legajo, UploadDocumentRequest request) {
        // Dummy: Añade el documento y responde perfil actualizado
        return new EmployeeTechnicalProfileDto(
            legajo,
            new SkillsDto(
                java.util.List.of("Java"),
                java.util.List.of("Git"),
                4
            ),
            java.util.List.of(),
            java.util.List.of(
                new DocumentDto(
                    request.title(),
                    request.category(),
                    request.fileName(),
                    java.time.LocalDate.now().toString()
                )
            )
        );
    }
}
