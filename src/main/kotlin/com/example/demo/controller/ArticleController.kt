package com.example.demo.controller

import com.example.demo.dto.ArticleCommand
import com.example.demo.request.ArticlePatchRequest
import com.example.demo.request.ArticleRequest
import com.example.demo.service.ArticleService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/article")
class ArticleController(private val service: ArticleService) {

    @GetMapping
    fun getArticles() = service.findAll()

    @PostMapping
    fun save(@RequestBody articleRequest: ArticleRequest) {
        val command = ArticleCommand(
            name = articleRequest.name,
            content = articleRequest.content,
            userId = articleRequest.userId
        )
        service.save(command)
    }

    @PatchMapping("/{id}")
    fun patch(@PathVariable id: Int, @RequestBody articleRequest: ArticlePatchRequest) {
        service.patchArticle(id, articleRequest.content)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Int) = service.delete(id)


}