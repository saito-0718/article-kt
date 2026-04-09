package com.example.demo.domain

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    val username: String = "",
    val email: String = "",
    val password: String = ""
)