package com.example.profile_service.repository;

import com.example.profile_service.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile,String> {
    @Query("SELECT p FROM Profile p WHERE " +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.address) LIKE LOWER(CONCAT('%', :keyword, '%'))"
    )
    Page<Profile> searchUsers(String keyword, Pageable pageable);
}
