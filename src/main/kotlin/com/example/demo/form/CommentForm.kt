package com.example.demo.form

import jakarta.validation.constraints.NotBlank

data class CommentForm(
    @field:NotBlank(message = "名前は必須です")
    val name:String="",
    @field:NotBlank(message = "投稿内容は必須です")
    val content:String="",
    //投稿のid用
    val articleId:Int
)