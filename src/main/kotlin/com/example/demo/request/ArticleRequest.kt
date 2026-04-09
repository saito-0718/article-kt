package com.example.demo.request

import jakarta.validation.constraints.NotBlank

data class ArticleRequest(
    val name: String? = null,
    @field:NotBlank(message = "投稿内容は必須です")
    val content: String = "",
    val userId: Int? = null
)