package com.example.Identity_Service.repository;

import com.example.Identity_Service.entity.User;
import com.example.Identity_Service.entity.UserLoginMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLoginMethodRepository extends JpaRepository<UserLoginMethod,String> {
    boolean existsByUserAndLoginType(User user, String loginType);
}
