package com.example.demo.form

import com.example.demo.dto.ArticleCommand
import jakarta.validation.constraints.NotBlank

data class ArticleForm(
    @field:NotBlank(message = "名前は必須です")
    val name:String="",
    @field:NotBlank(message = "投稿内容øは必須です")
    val content:String=""
)