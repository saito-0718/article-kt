package com.example.demo.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(
    name = "article_likes",
    uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "article_id"])]
)
@EntityListeners(AuditingEntityListener::class)
data class ArticleLike(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    val user: User? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "article_id")
    @JsonIgnore
    val article: Article? = null,

    @CreatedDate
    var createdAt: LocalDateTime? = null

) {
    val userId: Int?
        get() = user?.id

    val articleId: Int?
        get() = article?.id
}
