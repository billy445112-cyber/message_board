// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000, // 固定前端埠號

    // proxy：開發時將特定路徑的請求轉發到後端
    // 這樣前端的 fetch('/api/messages') 就會自動轉發到
    // http://localhost:8080/messages.php，避免 CORS 問題
    // （注意：這只在開發環境有效，正式部署需在伺服器設定）
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 後端位址
        changeOrigin: true,

        // 重寫路徑：把 /api/messages 改成 /messages.php
        // ^ 是正規表示式，匹配開頭的 /api
        rewrite: (path) => path.replace(/^\/api/, '').replace(/^\/(.+)$/, '/$1.php'),
      }
    }
  }
})