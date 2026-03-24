// api.js — 封裝所有和後端溝通的函式
// 集中管理 API 呼叫，未來改網址只需改這一個檔案

// 後端 API 的基礎路徑（對應 vite.config.js 的 proxy 設定）
const BASE = '/api/messages';

/**
 * 取得所有留言
 * @returns {Promise<Array>} 留言陣列
 */
export async function fetchMessages() {
  // fetch() 預設發 GET 請求
  const res = await fetch(BASE);

  // res.ok 為 true 表示 HTTP 狀態碼是 200-299
  if (!res.ok) throw new Error('取得留言失敗');

  // .json() 解析回應 body 為 JavaScript 物件
  return res.json();
}

/**
 * 新增留言
 * @param {string} author  留言者
 * @param {string} content 留言內容
 * @returns {Promise<Object>} 後端回傳的結果（包含新 id）
 */
export async function createMessage(author, content) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      // 告訴後端：body 的格式是 JSON
      'Content-Type': 'application/json',
    },
    // JSON.stringify 將 JS 物件序列化為 JSON 字串
    body: JSON.stringify({ author, content }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '新增失敗');
  }

  return res.json();
}

/**
 * 刪除留言
 * @param {number} id 要刪除的留言 ID
 * @returns {Promise<Object>} 後端回傳的結果
 */
export async function deleteMessage(id) {
  // 把 id 放在 URL 查詢字串，對應後端的 $_GET["id"]
  const res = await fetch(`${BASE}?id=${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '刪除失敗');
  }

  return res.json();
}