package com.example.demo.service

import com.example.demo.domain.ArticleLike
import com.example.demo.repository.ArticleLikeRepository
import com.example.demo.repository.ArticleRepository
import com.example.demo.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class ArticleLikeService(
    private val articleLikeRepository: ArticleLikeRepository,
    private val userRepository: UserRepository,
    private val articleRepository: ArticleRepository,
) {

    fun save(userId: Int, articleId: Int): ArticleLike {
        val articleLike = ArticleLike(
            user = userRepository.getReferenceById(userId),
            article = articleRepository.getReferenceById(articleId)
        )
        return articleLikeRepository.save(articleLike)
    }

    fun deleteById(id: Int) = articleLikeRepository.deleteById(id)
    
}
