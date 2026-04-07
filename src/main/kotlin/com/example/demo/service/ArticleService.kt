package com.example.demo.service

import com.example.demo.domain.Article
import com.example.demo.dto.ArticleCommand
import com.example.demo.repository.ArticleRepository
import org.springframework.stereotype.Service

@Service
class ArticleService(private val repository: ArticleRepository) {
    fun findAll() = repository.findAll()

    fun save(command: ArticleCommand) {
        val article = Article(
            name = command.name,
            content = command.content
        )
        repository.save(article)
    }
}