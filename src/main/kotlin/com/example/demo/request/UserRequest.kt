package com.example.demo.request

import jakarta.validation.constraints.NotBlank

data class UserRequest(
    @field:NotBlank(message = "名前は必須です")
    val name: String,
    @field:NotBlank(message = "メールアドレスは必須です")
    val email: String,
    @field:NotBlank(message = "パスワードは必須です")
    val password: String
)