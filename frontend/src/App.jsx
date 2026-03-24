// App.jsx — 應用程式的根元件
// 負責：1) 管理留言資料的狀態 2) 協調子元件之間的互動

import { useState, useEffect } from 'react';
import { fetchMessages } from './api';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

function App() {
  // messages: 目前的留言陣列，初始值為空陣列
  const [messages, setMessages] = useState([]);

  // loading: 是否正在向後端載入資料
  const [loading, setLoading] = useState(false);

  // error: 載入失敗時的錯誤訊息
  const [error, setError] = useState('');

  // loadMessages — 向後端 API 取得留言並更新 state
  async function loadMessages() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMessages(); // 呼叫 api.js
      setMessages(data);                  // 更新 state，觸發 re-render
    } catch (err) {
      setError('載入留言失敗：' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // useEffect 在元件「掛載（mount）」時自動執行一次
  // 第二個參數 [] 是依賴陣列，空陣列 = 只在首次渲染後執行一次
  // 等同於 class component 的 componentDidMount
  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div>
      <h1>留言板</h1>

      {/* 新增留言表單；onSuccess 傳入 loadMessages 當 callback */}
      <MessageForm onSuccess={loadMessages} />

      <hr />

      <h2>所有留言</h2>

      {/* 條件渲染：依狀態顯示不同內容 */}
      {loading && <p>載入中...</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}

      {/* 只有不在載入中才顯示列表，避免閃爍 */}
      {!loading && (
        <MessageList
          messages={messages}
          onRefresh={loadMessages} //刪除後重新載入
        />
      )}
    </div>
  );
}

export default App;