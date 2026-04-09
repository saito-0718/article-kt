package com.example.demo.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(name = "articles")
@EntityListeners(AuditingEntityListener::class)
data class Article(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    val name: String? = null,

    var content: String = "",

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    val user: User? = null,

    @OneToMany(mappedBy = "article", fetch = FetchType.LAZY)
    val commentList: List<Comment> = emptyList(),

    @CreatedDate
    var createdAt: LocalDateTime? = null,

    @LastModifiedDate
    var updatedAt: LocalDateTime? = null

) {
    val displayName: String?
        get() = name ?: user?.username

    val userId: Int?
        get() = user?.id
}
