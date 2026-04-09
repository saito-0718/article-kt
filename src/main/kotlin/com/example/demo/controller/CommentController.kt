package com.example.demo.controller

import com.example.demo.dto.CommentCommand
import com.example.demo.request.CommentRequest
import com.example.demo.service.CommentService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/comment")
class CommentController (private val commentService: CommentService) {

    @PostMapping
    fun save(commentRequest: CommentRequest){
        val commentCommand = CommentCommand(
            name = commentRequest.name,
            content = commentRequest.content,
            articleId = commentRequest.articleId
        )
        commentService.save(commentCommand)
    }
}