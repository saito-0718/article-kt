package com.example.demo.dto

data class CommentCommand(
    val name: String,
    val content: String,
    val articleId: Int
)