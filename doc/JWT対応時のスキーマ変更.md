**## スキーマ変更

### users テーブル(新規テーブル)
| カラム名 | 型 | 制約 | 説明 |
|:-----------|:------------|:------------|:------------|
| id | serial | PK | ユーザID |
| username | var(50) | NOT NULL | 名前 |
| email | var(255) | NOT NULL UNIQUE | メールアドレス |
| password | var(255) | NOT NULL | パスワード |
| created_at | TIMESTAMPTZ| NOT NULL | 作成日時 (新規)|
| updated_at | TIMESTAMPTZ| NOT NULL | 更新日時 (新規)|

### articlesテーブル(既存テーブル)

#### 変更前
| カラム名 | 型 | 制約 | 説明 |
|:-----------|:------------|:------------|:------------|
| id | serial | PK | 投稿ID |
| name | text | NOT NULL |名前 |
| content | text | NOT NULL | 記事内容 |

#### 変更後
| カラム名 | 型 | 制約 | 説明 |
|:-----------|:------------|:------------|:------------|
| id | serial | PK | 投稿ID |
| name | text | NOT NULL |名前 |
| content | text | NOT NULL | 記事内容 |
| user_id | INTEGER | FK | ユーザID (新規) |
| created_at | TIMESTAMPTZ | NOT NULL | 作成日時 (新規)|
| updated_at | TIMESTAMPTZ | NOT NULL | 更新日時 (新規)|

### comments テーブル(既存テーブル)

#### 変更前
| カラム名 | 型 | 制約 | 説明 |
|:-----------|:------------|:------------|:------------|
| id | serial | PK | コメントID |
| name | text | NOT NULL |名前 |
| content | text | NOT NULL | コメント内容 |
| article_id | INTEGER | FK | 投稿ID |

#### 変更後
| カラム名 | 型 | 制約 | 説明 |
|:-----------|:------------|:------------|:------------|
| id | serial | PK | コメントID |
| name | text | ---(変更) |名前 |
| content | text | NOT NULL | コメント内容 |
| article_id | INTEGER | FK | 投稿ID |
| user_id | INTEGER | FK |  コメント者 ID(新規) |
| created_at | TIMESTAMPTZ | NOT NULL | 作成日時 (新規)|
| updated_at | TIMESTAMPTZ | NOT NULL | 更新日時 (新規)|**