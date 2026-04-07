package com.example.demo.service

import com.example.demo.repository.ArticleRepository
import org.springframework.stereotype.Service

@Service
class ArticleService(private val repository: ArticleRepository) {
    fun findAll() = repository.findAll()
}