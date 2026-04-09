package com.example.demo.service

import com.example.demo.domain.User
import com.example.demo.dto.UserCommand
import com.example.demo.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val repository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    fun save(command: UserCommand) {
        // passwordハッシュ化
        val hashed = passwordEncoder.encode(command.password) ?: throw IllegalStateException("Password encoding failed")

        val user = User(
            username = command.name,
            email = command.email,
            password = hashed
        )
        repository.save(user)
    }

    fun findByEmail(email: String): User? = repository.findByEmail(email)

    fun existsByEmail(email: String): Boolean = repository.existsByEmail(email)
}