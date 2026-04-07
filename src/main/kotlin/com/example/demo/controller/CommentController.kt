package com.example.demo.controller

import com.example.demo.domain.Comment
import com.example.demo.dto.CommentCommand
import com.example.demo.form.CommentForm
import com.example.demo.service.CommentService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/comment")
class CommentController (private val commentService: CommentService) {

    @PostMapping
    fun save(commentForm: CommentForm){
        val commentCommand = CommentCommand(
            name = commentForm.name,
            content = commentForm.content,
            articleId = commentForm.articleId
        )
        commentService.save(commentCommand)
    }
}