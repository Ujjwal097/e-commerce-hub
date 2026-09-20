package com.lumina.ecommerce.repository;

import com.lumina.ecommerce.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findTopByIdentifierAndCodeOrderByExpiresAtDesc(String identifier, String code);

    @Transactional
    void deleteByIdentifier(String identifier);
}
