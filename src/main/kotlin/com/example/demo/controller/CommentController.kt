package com.example.demo.controller

import com.example.demo.dto.CommentCommand
import com.example.demo.request.CommentPatchRequest
import com.example.demo.request.CommentRequest
import com.example.demo.service.CommentService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/comment")
class CommentController(private val commentService: CommentService) {

    @PostMapping
    fun save(commentRequest: CommentRequest) {
        val commentCommand = CommentCommand(
            name = commentRequest.name,
            content = commentRequest.content,
            articleId = commentRequest.articleId,
            userId = commentRequest.userId
        )
        commentService.save(commentCommand)
    }

    @PatchMapping("/{commentId}")
    fun patch(@PathVariable commentId: Int, @RequestBody commentRequest: CommentPatchRequest) {
        commentService.patchComment(commentId, commentRequest.content)
    }

    @DeleteMapping("/{commentId}")
    fun delete(@PathVariable commentId: Int) = commentService.delete(commentId)
}