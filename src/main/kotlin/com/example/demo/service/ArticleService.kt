package com.example.demo.service

import com.example.demo.domain.Article
import com.example.demo.dto.ArticleCommand
import com.example.demo.repository.ArticleRepository
import com.example.demo.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class ArticleService(
    private val repository: ArticleRepository,
    private val userRepository: UserRepository
) {
    fun findAll() = repository.findAll()

    fun save(command: ArticleCommand) {
        val user = command.userId?.let { userRepository.findById(it).orElse(null) }
        val article = Article(
            name = command.name,
            content = command.content,
            user = user
        )
        repository.save(article)
    }

    fun patchArticle(id: Int, content: String) {
        val targetArticle = repository.findById(id).orElseThrow()
        targetArticle.content = content
        repository.save(targetArticle)
    }

    fun delete(id: Int) = repository.deleteById(id)

}
