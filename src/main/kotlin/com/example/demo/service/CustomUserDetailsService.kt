package com.example.demo.service

import com.example.demo.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val repository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails {
        val user = repository.findByEmail(email)
            ?: throw UsernameNotFoundException("User not found")

        return org.springframework.security.core.userdetails.User(
            user.email,
            user.password,
            emptyList() // 権限が不要ならこれでOK
        )
    }
}
