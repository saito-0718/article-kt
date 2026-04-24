package com.example.demo.repository

import com.example.demo.domain.ArticleLike
import org.springframework.data.jpa.repository.JpaRepository

interface ArticleLikeRepository : JpaRepository<ArticleLike, Int> {
}