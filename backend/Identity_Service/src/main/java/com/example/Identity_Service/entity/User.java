package com.example.Identity_Service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users") // Tránh trùng với từ khóa SQL
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id_user;

    @Column(nullable = false, unique = true)
    String email; // Email là duy nhất

    @Column(nullable = false, unique = true)
    String username;

    @Column(nullable = false)
    String password;

    String avatar;

    boolean isActive=true;

    @CreationTimestamp
    Timestamp createAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    Set<UserLoginMethod> loginMethods; // Liên kết đến phương thức đăng nhập

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    Set<Role> roles;
}
