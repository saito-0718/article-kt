package com.example.demo.repository

import com.example.demo.domain.Comment
import org.springframework.data.jpa.repository.JpaRepository

interface CommentRepository: JpaRepository<Comment, Int>