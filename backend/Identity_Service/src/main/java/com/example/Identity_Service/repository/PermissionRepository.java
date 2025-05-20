package com.example.Identity_Service.repository;

import com.example.Identity_Service.entity.Permission;
import com.example.Identity_Service.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission,String> {

    public Permission findByName(String name);

    @Query("select Permission from Permission where name in :permissions ")
    public List<Permission> getAllPermissionById(@Param("permissions") Set<String> permissionsName);
    @Query("select p from Permission p where  " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
    )
    Page<Permission> searchPermission(String keyword, Pageable pageable);
}
