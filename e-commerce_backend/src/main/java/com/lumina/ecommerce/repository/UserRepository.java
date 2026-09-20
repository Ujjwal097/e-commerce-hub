package com.lumina.ecommerce.repository;

import com.lumina.ecommerce.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByIdentifier(String identifier);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByPhoneNumber(String phoneNumber);

    Optional<UserEntity> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByUsername(String username);

    default Optional<UserEntity> findByEmailOrPhone(String identifier) {
        if (identifier == null) return Optional.empty();
        String clean = identifier.trim().toLowerCase();
        Optional<UserEntity> byEmail = findByEmail(clean);
        if (byEmail.isPresent()) return byEmail;

        Optional<UserEntity> byPhone = findByPhoneNumber(clean);
        if (byPhone.isPresent()) return byPhone;

        return findByIdentifier(clean);
    }
}
