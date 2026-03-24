# Message Board — React + PHP + MySQL

一個用於學習全端串接的簡易留言板專案。

## 專案結構

message_board/
├── frontend/   # React 前端（Vite）
└── backend/    # PHP 後端 API

## 技術棧

- **前端**：React + Vite
- **後端**：PHP 8
- **資料庫**：MySQL 8

## 啟動方式

### 1. 建立資料庫

用 phpMyAdmin 或 MySQL 終端機執行：

CREATE DATABASE message_board CHARACTER SET utf8mb4;

USE message_board;

CREATE TABLE messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  author     VARCHAR(100) NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### 2. 設定資料庫連線

編輯 `backend/db.php`，填入你的 MySQL 帳號密碼：

$user = "你的帳號";
$pass = "你的密碼";

### 3. 啟動後端

cd backend
php -S localhost:8080

### 4. 啟動前端

cd frontend
npm install
npm run dev

### 5. 開啟瀏覽器

前往 http://localhost:3000

## 環境需求

- PHP 8+
- MySQL 8+
- Node.js 18+
- Composer（非必要）

## API 端點

| 方法   | 路徑            | 說明       |
|--------|-----------------|------------|
| GET    | /messages.php   | 取得所有留言 |
| POST   | /messages.php   | 新增留言   |
| DELETE | /messages.php?id=N | 刪除留言 |

## 注意事項

- `db.php` 含有資料庫密碼，請勿上傳到公開倉庫
- 本專案僅供學習用途，不含任何樣式設計