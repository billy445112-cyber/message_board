<?php
// messages.php — 留言板 REST API
// 支援的操作：
//   GET  /messages.php       → 取得所有留言
//   POST /messages.php       → 新增一則留言
//   DELETE /messages.php?id=N → 刪除指定留言

// ---- 允許跨來源請求（CORS）----
// 因為 React 開發伺服器（localhost:3000）和 PHP 伺服器（localhost:80）
// 是不同的「來源」，瀏覽器的同源政策會擋住 fetch 請求。
// 加上以下 headers 告訴瀏覽器：允許這個 PHP 被其他網域呼叫。
header("Access-Control-Allow-Origin: http://localhost:3000");

// 允許的 HTTP 方法
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

// 允許前端傳送 Content-Type header（POST JSON 時需要）
header("Access-Control-Allow-Headers: Content-Type");

// 宣告回應格式為 JSON
header("Content-Type: application/json");

// ---- 處理 OPTIONS 預檢請求 ----
// 瀏覽器在發送「非簡單請求」（如 DELETE、帶有 Content-Type 的 POST）前，
// 會先發一個 OPTIONS 請求詢問伺服器是否允許，這稱為「預檢（preflight）」。
// 我們只需回 200 讓瀏覽器知道可以繼續，不需做任何處理。
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// 引入資料庫連線（$pdo 變數在 db.php 中定義）
require_once "db.php";

// 取得本次請求的 HTTP 方法（GET / POST / DELETE）
$method = $_SERVER["REQUEST_METHOD"];

// ---- 路由分派：依 HTTP 方法決定要做什麼 ----
if ($method === "GET") {
    // ---- 取得所有留言 ----

    // prepare() 建立預備語句，防止 SQL injection
    $stmt = $pdo->prepare(
        "SELECT id, author, content, created_at
         FROM messages
         ORDER BY created_at DESC"  // 最新的排前面
    );
    $stmt->execute();

    // fetchAll() 取回所有結果，格式為關聯陣列組成的陣列
    $messages = $stmt->fetchAll();

    // json_encode() 將 PHP 陣列轉成 JSON 字串回傳給前端
    echo json_encode($messages);

} elseif ($method === "POST") {
    // ---- 新增留言 ----

    // 前端用 fetch + JSON.stringify 送來的資料在 HTTP body 裡，
    // 需用 file_get_contents("php://input") 讀取原始 body 字串，
    // 再用 json_decode 解析成 PHP 物件（true = 解析為關聯陣列）
    $body = json_decode(file_get_contents("php://input"), true);

    // 基本驗證：確保 author 和 content 欄位存在且不為空
    $author  = trim($body["author"]  ?? "");
    $content = trim($body["content"] ?? "");

    if ($author === "" || $content === "") {
        http_response_code(400); // 400 Bad Request
        echo json_encode(["error" => "author 和 content 不能為空"]);
        exit;
    }

    // 使用 :author、:content 佔位符（named placeholder），
    // PDO 會自動跳脫特殊字元，防止 SQL injection
    $stmt = $pdo->prepare(
        "INSERT INTO messages (author, content) VALUES (:author, :content)"
    );
    $stmt->execute([
        ":author"  => $author,
        ":content" => $content,
    ]);

    // 取得剛插入的新 ID
    $newId = $pdo->lastInsertId();

    // 回傳 201 Created，並帶回新資料的 ID
    http_response_code(201);
    echo json_encode(["message" => "新增成功", "id" => $newId]);

} elseif ($method === "DELETE") {
    // ---- 刪除留言 ----

    // DELETE 請求透過 URL 查詢字串傳 id，例如：DELETE /messages.php?id=3
    $id = intval($_GET["id"] ?? 0); // intval() 確保是整數，防止非數字輸入

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "需提供有效的 id"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM messages WHERE id = :id");
    $stmt->execute([":id" => $id]);

    // rowCount() 回傳受影響的行數，0 表示沒找到該 id
    if ($stmt->rowCount() === 0) {
        http_response_code(404); // 404 Not Found
        echo json_encode(["error" => "找不到 id={$id} 的留言"]);
    } else {
        echo json_encode(["message" => "刪除成功"]);
    }

} else {
    // 不支援的 HTTP 方法
    http_response_code(405); // 405 Method Not Allowed
    echo json_encode(["error" => "不支援的方法：{$method}"]);
}