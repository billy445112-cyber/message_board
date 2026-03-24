// MessageList.jsx — 顯示留言列表，並提供刪除功能

import { deleteMessage } from './api';

// Props:
//   messages  — 留言陣列，由父元件（App）傳入
//   onRefresh — 刪除後呼叫，通知父元件重新載入
function MessageList({ messages, onRefresh }) {

  async function handleDelete(id) {
    // window.confirm 跳出確認框，使用者按取消則不執行
    if (!window.confirm(`確定刪除 id=${id} 的留言？`)) return;

    try {
      await deleteMessage(id);
      // 刪除成功後請父元件重新載入列表
      onRefresh();
    } catch (err) {
      alert('刪除失敗：' + err.message);
    }
  }

  if (messages.length === 0) {
    return <p>目前沒有留言。</p>;
  }

  return (
    <ul>
      {/* 用 map 把每筆留言資料渲染成 <li> */}
      {messages.map((msg) => (
        // key 是 React 在 Virtual DOM diff 時用來識別每個元素的必要屬性
        // 應使用唯一且穩定的值（這裡用資料庫的 id）
        <li key={msg.id}>
          <strong>{msg.author}</strong>：{msg.content}
          <small>（{msg.created_at}）</small>
          {/* 按鈕帶入 msg.id，刪除對應的留言 */}
          <button onClick={() => handleDelete(msg.id)}>刪除</button>
        </li>
      ))}
    </ul>
  );
}

export default MessageList;