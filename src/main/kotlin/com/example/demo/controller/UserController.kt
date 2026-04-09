package com.example.demo.controller

import com.example.demo.dto.UserCommand
import com.example.demo.request.UserRequest
import com.example.demo.service.UserService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController(private val service: UserService) {

    @PostMapping("/register")
    fun save(@Valid @RequestBody request: UserRequest) {
        // email重複チェック
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
}