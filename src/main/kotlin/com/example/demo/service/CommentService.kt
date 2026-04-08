package com.example.demo.service

import com.example.demo.domain.Article
import com.example.demo.domain.Comment
import com.example.demo.dto.CommentCommand
import com.example.demo.repository.CommentRepository
import org.springframework.stereotype.Service

@Service
class CommentService (private val repository: CommentRepository) {

    fun save(command: CommentCommand){
        val article = Article(id = command.articleId)
        val comment = Comment(
            name = command.name,
            content = command.content,
            article = article
        )
        repository.save(comment)
    }
}
