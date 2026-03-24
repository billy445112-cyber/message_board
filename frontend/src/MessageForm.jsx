// MessageForm.jsx — 負責「新增留言」的表單元件
// 職責單一：只處理輸入和送出，不管留言列表

import { useState } from 'react';
import { createMessage } from './api';

// Props:
//   onSuccess — 新增成功後呼叫的 callback，通知父元件刷新列表
function MessageForm({ onSuccess }) {
  // useState 管理表單欄位的值
  const [author, setAuthor]   = useState('');
  const [content, setContent] = useState('');

  // 送出中的狀態，用來停用按鈕防止重複送出
  const [loading, setLoading] = useState(false);

  // 錯誤訊息
  const [error, setError] = useState('');

  // 表單送出處理函式
  async function handleSubmit(e) {
    // 阻止瀏覽器預設的表單送出（會導致頁面重整）
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 呼叫 api.js 的 createMessage，傳送資料到後端
      await createMessage(author, content);

      // 成功後清空表單
      setAuthor('');
      setContent('');

      // 通知父元件（App）重新載入留言列表
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      // 無論成功或失敗，都解除 loading 狀態
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>新增留言</h2>

      {/* 顯示錯誤訊息（如果有的話） */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="author">名稱：</label>
        <input
          id="author"
          type="text"
          value={author}
          // onChange 在每次鍵入時更新 state，這是 React 的「受控元件」模式
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="content">內容：</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={3}
        />
      </div>

      {/* disabled 在送出中時停用按鈕，防止重複送出 */}
      <button type="submit" disabled={loading}>
        {loading ? '送出中...' : '送出留言'}
      </button>
    </form>
  );
}

export default MessageForm;
