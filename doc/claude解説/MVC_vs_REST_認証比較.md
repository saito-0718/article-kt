# MVC モデル vs REST モデル　認証の違い

---

## 構成の違い

### MVC モデル（サーバーサイドレンダリング）

```
ブラウザ  ←───HTMLを返す───  Spring Boot
               （Thymeleafなど）
                    │
               HTML/CSS/JSを
               サーバーが生成
```

- サーバーがHTMLを作って返す
- ブラウザはHTMLを表示するだけ
- 例：Spring Boot + Thymeleaf

### REST モデル（フロントエンド分離）

```
ブラウザ（React）  ←───JSONを返す───  Spring Boot
    │                                  （APIサーバー）
    │
Reactが画面を生成
```

- サーバーはJSONだけを返す
- 画面の生成はブラウザ側（React）が担当
- 例：Spring Boot（API） + React（今回のプロジェクト）

---

## 認証方式の違い

| 項目 | MVC（セッション認証） | REST（JWT認証） |
|---|---|---|
| 認証情報の保存場所 | **サーバー**のセッション | **ブラウザ**のlocalStorage |
| ブラウザが送るもの | Cookie（SessionID） | Authorizationヘッダー（Bearer Token） |
| サーバーの状態 | **ステートフル**（セッションを持つ） | **ステートレス**（セッションを持たない） |
| CSRF対策 | **必要**（デフォルト有効） | **不要**（Cookieを使わないため） |
| ログアウト | サーバー側でセッション削除 | ブラウザ側でトークン削除（サーバーは何もしない） |

---

## セッション認証（MVC）の仕組み

```
【ログイン】
ブラウザ                        サーバー
   │  POST /login               │
   │  email + password ─────────>│
   │                            │ セッション生成・保存
   │  Cookie: JSESSIONID=abc ───<│
   │                            │

【以降のリクエスト】
ブラウザ                        サーバー
   │  GET /dashboard            │
   │  Cookie: JSESSIONID=abc ───>│
   │                            │ abc のセッションを検索
   │                            │ → 認証済みと判断
   │  HTMLを返す ───────────────<│
```

**ポイント:**
- サーバーが認証状態を**記憶**している（ステートフル）
- Cookieはブラウザが**自動で**送信する
- セッションが増えるほどサーバーのメモリを消費する
- 複数台のサーバーにスケールアウトする場合、セッションの共有が必要になる

---

## JWT認証（REST）の仕組み

```
【ログイン】
ブラウザ（React）                APIサーバー
   │  POST /users/login          │
   │  { email, password } ───────>│
   │                             │ JWTトークン生成
   │  { token: "eyJ..." } ───────<│
   │                             │
   │  localStorageに保存         │

【以降のリクエスト】
ブラウザ（React）                APIサーバー
   │  GET /article               │
   │  Authorization: Bearer eyJ..>│
   │                             │ トークンの署名を検証
   │                             │ → 有効なら認証済みと判断
   │  JSONを返す ────────────────<│
```

**ポイント:**
- サーバーは認証状態を**記憶しない**（ステートレス）
- トークンの正しさは**署名の検証**だけで判断する（DBを見ない）
- どのサーバーが受け取っても同じ秘密鍵で検証できる → スケールアウトが容易
- トークンをlocalStorageに保存するため、JSから取り出してヘッダーに手動でセットする必要がある

---

## CSRF攻撃への対応の違い

### CSRF攻撃とは

```
悪意あるサイト
    │
    │  ユーザーがログイン済みであることを利用して
    │  勝手にリクエストを送りつける攻撃
    │
    ▼
example.com/transfer?to=attacker&amount=10000
```

### MVC（Cookie）がCSRFを受ける理由

```
ブラウザは Cookie を「同じドメイン以外からのリクエストでも」自動送信してしまう
    → 悪意あるサイトからのフォーム送信でも Cookie（SessionID）が付いてしまう
    → サーバーは正規ユーザーのリクエストと区別できない
```

**対策:** Spring Security がCSRFトークンを発行し、フォーム送信時に照合する。

### REST（JWT）がCSRFを受けない理由

```
JWTはlocalStorageに保存され、JavaScriptで手動でヘッダーにセットする
    → 悪意あるサイトのJSは別ドメインのlocalStorageにアクセスできない（同一オリジンポリシー）
    → Authorizationヘッダーは自動送信されない
    → CSRF攻撃が成立しない
```

**そのため REST構成では `csrf { it.disable() }` にしてOK。**

---

## ログアウトの違い

### MVC（セッション認証）

```kotlin
// サーバー側でセッションを削除する → 以降は同じCookieを送っても無効
.logout { logout ->
    logout
        .invalidateHttpSession(true)   // セッション削除
        .deleteCookies("JSESSIONID")   // Cookie削除
}
```

- サーバーがセッションを削除するので**確実に無効化**できる
- 万が一SessionIDが漏れても、ログアウト済みなら使えない

### REST（JWT認証）

```js
// ブラウザ側でトークンを削除するだけ
localStorage.removeItem('token')
```

- サーバーはトークンを記憶していないので、**サーバー側では何もしない**
- **弱点:** トークンが漏れた場合、有効期限が切れるまで悪用される可能性がある
- 対策案：有効期限を短くする / ブラックリストをサーバーで管理する（ステートレスの利点が薄れる）

---

## 今回のプロジェクトの設定まとめ

```kotlin
// SecurityConfig.kt
http
    .csrf { it.disable() }        // REST構成のためCSRF無効
    .cors { it.disable() }
    .sessionManagement { session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // セッションを使わない
    }
    .authorizeHttpRequests { auth ->
        auth
            .requestMatchers("/users/register", "/users/login").permitAll()
            .requestMatchers("/article/**", "/comment/**").permitAll()
            .requestMatchers("/", "/index.html", "/assets/**").permitAll()
            .anyRequest().authenticated()
    }
    .addFilterBefore(
        jwtAuthenticationFilter,          // JWTを検証するフィルター
        UsernamePasswordAuthenticationFilter::class.java
    )
    .formLogin { it.disable() }   // フォームログイン不要
    .httpBasic { it.disable() }   // Basic認証不要
```

---

## まとめ図

```
                MVC（セッション）              REST（JWT）
                ─────────────────             ──────────────────
認証情報の場所   サーバーのメモリ               トークン自体（ブラウザ）
状態            ステートフル                   ステートレス
送信方法        Cookie（自動）                 Authorizationヘッダー（手動）
CSRF            対策が必要                     不要
スケール        セッション共有が必要            どのサーバーでも検証可能
ログアウト      確実（サーバー側で無効化）       不完全（期限切れまで有効）
向いている用途  従来のWebアプリ                 SPA・モバイルアプリ・API
```
