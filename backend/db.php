<?php

$host     = "localhost";          // MySQL 伺服器位置（本機用 localhost）
$dbname   = "message_board";      //資料庫名稱
$user     = "root";               //資料庫帳號
$pass     = "qweasd20260428";     //資料庫密碼

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",$user,$pass,
        [
            // 當 SQL 執行錯誤時，自動丟出 Exception，方便 catch 捕捉
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            // 查詢結果預設以關聯陣列（key => value）回傳
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,

        ]
    );
}catch (PDOException $e) {
    // 若連線失敗，回傳 JSON 格式的錯誤訊息給前端
    http_response_code(500);
    echo json_encode(["error" => "資料庫連線失敗：" . $e->getMessage()]);
    exit; // 停止後續執行
}