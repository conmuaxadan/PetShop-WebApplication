package com.example.profile_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity(name = "Profile")
public class Profile {
    @Id
    String id_user;
    String firstName;
    String lastName;
    @OneToOne(cascade = CascadeType.ALL,orphanRemoval = true)
    Address address;
    @Column(unique = true)
    String email;
    @Column(unique = true)
    String phone;
    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    boolean isActive = true;
    @CreationTimestamp
    Timestamp createAt;

}
