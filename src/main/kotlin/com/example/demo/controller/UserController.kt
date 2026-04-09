package com.example.demo.controller

import com.example.demo.dto.UserCommand
import com.example.demo.request.LoginRequest
import com.example.demo.request.UserRequest
import com.example.demo.service.JwtService
import com.example.demo.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController(
    private val service: UserService,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val jwtService: JwtService
) {

    @PostMapping("/register")
    fun save(@Valid @RequestBody request: UserRequest) {
        if (service.existsByEmail(request.email)) {
            throw IllegalArgumentException("Email already registered")
        }
        val command = UserCommand(
            name = request.name,
            email = request.email,
            password = request.password
        )
        service.save(command)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        return try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.email, request.password)
            )
            val userDetails = userDetailsService.loadUserByUsername(request.email)
            val token = jwtService.generateToken(userDetails)
            val user = service.findByEmail(request.email)!!
            ResponseEntity.ok(mapOf("token" to token, "name" to user.username, "userId" to user.id))
        } catch (e: BadCredentialsException) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "emailアドレスかパスワードが間違っています"))
        }
    }
}
