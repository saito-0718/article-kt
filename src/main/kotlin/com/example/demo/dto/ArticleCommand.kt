package com.example.demo.dto

data class ArticleCommand(
    val name: String?,
    val content: String,
    val userId: Int?
)