package com.example.demo.service

import com.example.demo.domain.Article
import com.example.demo.domain.Comment
import com.example.demo.dto.CommentCommand
import com.example.demo.repository.CommentRepository
import com.example.demo.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class CommentService(
    private val repository: CommentRepository,
    private val userRepository: UserRepository
) {

    fun save(command: CommentCommand) {
        val user = command.userId?.let { userRepository.findById(it).orElse(null) }
        val article = Article(id = command.articleId)
        val comment = Comment(
            name = command.name,
            content = command.content,
            article = article,
            user = user
        )
        repository.save(comment)
    }

    fun patchComment(id: Int, content: String) {
        val targetComment = repository.findById(id).orElseThrow()
        targetComment.content = content
        repository.save(targetComment)
    }

    fun delete(id: Int) = repository.deleteById(id)

}
