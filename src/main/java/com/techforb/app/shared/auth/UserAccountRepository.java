package com.techforb.app.shared.auth;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccountEntity, String> {

    Optional<UserAccountEntity> findByEmailIgnoreCase(String email);
}
