package com.example.demo.controller

import com.example.demo.dto.ArticleCommand
import com.example.demo.form.ArticleForm
import com.example.demo.service.ArticleService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/article")
class ArticleController(private val service: ArticleService ) {

    @GetMapping
    fun getArticles()= service.findAll()

    @PostMapping
    fun save(@RequestBody articleForm: ArticleForm) {
        val command = ArticleCommand(
            name = articleForm.name,
            content = articleForm.content
        )
        service.save(command)
    }

}