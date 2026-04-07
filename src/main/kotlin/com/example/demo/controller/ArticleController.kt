package com.example.demo.controller

import com.example.demo.service.ArticleService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/article")
class ArticleController(private val service: ArticleService ) {

    @GetMapping
    fun getArticles()= service.findAll()


}