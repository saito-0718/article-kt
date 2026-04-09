package com.example.demo.request

import jakarta.validation.constraints.NotBlank

data class ArticleRequest(
    @field:NotBlank(message = "名前は必須です")
    val name: String = "",
    @field:NotBlank(message = "投稿内容は必須です")
    val content: String = ""
)