# Spring MVC + Spring Security の挙動

> Spring Boot + Thymeleaf などの**サーバーサイドレンダリング構成**における Spring Security の動き方を解説する。

---

## 構成イメージ

```
ブラウザ
  │  HTMLページをリクエスト
  ▼
Spring Boot（サーバー）
  ├── Spring Security（フィルター）
  ├── Controller（@Controller）
  ├── Service / Repository
  └── Thymeleaf（HTMLを生成してレスポンス）
```

HTML・CSS・JSはすべてサーバーが生成して返す。ブラウザはHTMLを受け取って表示するだけ。

---

## 認証の仕組み：セッションとCookie

MVC構成では **セッション（サーバー側）+ Cookie（ブラウザ側）** で認証状態を管理する。

```
1. ログイン成功
       ├── サーバー側：セッションを生成して認証情報を保存
       └── ブラウザ側：SessionID が Cookie に自動でセットされる

2. 次回以降のリクエスト
       ├── ブラウザが Cookie（SessionID）を自動送信
       └── サーバーがSessionIDをもとにセッションを検索 → 認証済みと判断
```

---

## Spring Security のデフォルト動作（MVC）

Spring Security を導入するだけで、以下が**自動で**有効になる。

### ① ログインフォームの自動生成

```kotlin
// SecurityConfig に何も書かなければデフォルトのログイン画面が提供される
http.formLogin { }
```

`/login` にアクセスすると Spring Security が用意したHTMLフォームが表示される。

### ② リダイレクト制御

```
未認証のユーザーが /dashboard にアクセス
    → Spring Security が自動で /login にリダイレクト
    → ログイン成功後、元の /dashboard に自動で戻す
```

これは Spring Security が `SavedRequestAwareAuthenticationSuccessHandler` で元のURLを記憶しているため。

### ③ CSRF保護（デフォルト有効）

MVC構成では **CSRF対策がデフォルトで有効**。

```
ブラウザ → フォーム送信 → CSRFトークンが自動付与される（Thymeleafが埋め込む）
サーバー → トークンを検証 → 一致しなければ403エラー
```

Thymeleafを使う場合、`<form>` タグ内に自動でトークンが埋め込まれる。

```html
<form th:action="@{/login}" method="post">
    <!-- Spring Securityが自動で以下を埋め込む -->
    <input type="hidden" name="_csrf" value="abc123..."/>
    ...
</form>
```

---

## ログイン処理の流れ（MVC）

```
① ブラウザが POST /login に email + password を送信（フォーム送信）

② Spring Security の UsernamePasswordAuthenticationFilter が受け取る
        ↓
③ UserDetailsService.loadUserByUsername(email) でDBからユーザー取得
        ↓
④ PasswordEncoder.matches() でパスワード照合
        ↓
⑤-A 認証失敗 → /login?error にリダイレクト（エラーメッセージ表示）
⑤-B 認証成功 → セッション生成 → Cookie に SessionID をセット
        ↓
⑥ 元々アクセスしようとしていたページにリダイレクト（なければ /）
```

### SecurityConfig の書き方（MVC）

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { }  // デフォルトで有効（無効化しない）
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // セッションを使う
            }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/login", "/register", "/css/**", "/js/**").permitAll()
                    .anyRequest().authenticated()
            }
            .formLogin { form ->
                form
                    .loginPage("/login")           // 自作ログインページのURL
                    .defaultSuccessUrl("/")        // ログイン成功後の遷移先
                    .failureUrl("/login?error")    // ログイン失敗後の遷移先
                    .permitAll()
            }
            .logout { logout ->
                logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/login")    // ログアウト後の遷移先
                    .invalidateHttpSession(true)   // セッション削除
                    .deleteCookies("JSESSIONID")   // Cookie削除
            }

        return http.build()
    }
}
```

---

## ログアウト処理の流れ（MVC）

```
① ブラウザが POST /logout を送信

② Spring Security がセッションを無効化（サーバー側の認証情報を削除）

③ ブラウザの Cookie（JSESSIONID）を削除

④ /login にリダイレクト
```

サーバー側でセッションを消すため、**同じCookieを使いまわしても認証できなくなる**。

---

## 認証状態の確認方法（Controller側）

```kotlin
@Controller
class DashboardController {

    @GetMapping("/dashboard")
    fun dashboard(model: Model, principal: Principal): String {
        // ログイン中のユーザー名（email）が取れる
        val email = principal.name
        model.addAttribute("email", email)
        return "dashboard"  // dashboard.html を返す
    }
}
```

または SecurityContextHolder から取得:

```kotlin
val auth = SecurityContextHolder.getContext().authentication
val email = auth.name
```

---

## Thymeleaf での認証情報の利用

```html
<!-- ログイン中のユーザー名を表示 -->
<span sec:authentication="name">ユーザー名</span>

<!-- ログイン済みの場合だけ表示 -->
<div sec:authorize="isAuthenticated()">
    ログアウト
</div>

<!-- 未ログインの場合だけ表示 -->
<div sec:authorize="isAnonymous()">
    ログイン
</div>
```

`thymeleaf-extras-springsecurity` の依存を追加すると `sec:` 属性が使えるようになる。

---

## まとめ

| 項目 | 動作 |
|---|---|
| 認証状態の保持 | サーバーのセッション + ブラウザのCookie（JSESSIONID） |
| 未認証アクセス | /login に自動リダイレクト |
| ログイン処理 | Spring Security が自動処理（フィルターが動く） |
| CSRF保護 | デフォルトで有効（Thymeleafが自動でトークン埋め込み） |
| ログアウト | セッション削除 + Cookie削除 |
| HTMLの生成 | サーバー側（Thymeleaf）が担当 |
