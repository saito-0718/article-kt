package com.example.demo.domain

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Table
import jakarta.persistence.Id
import jakarta.persistence.OneToMany

@Entity
@Table(name = "articles")
data class Article(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id:Int = 0,
    val name:String = "",
    val content:String = "",
    @OneToMany(mappedBy = "article", fetch = FetchType.LAZY)
    val commentList:List<Comment> = emptyList()
)