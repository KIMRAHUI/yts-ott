import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 댓글/후기 API → Render 배포된 백엔드
      '/api/comments': {
        target: 'https://yts-backend.onrender.com',
        changeOrigin: true,
      },
      // 회원가입/로그인/결제정보 API → Render 배포된 백엔드
      '/api/auth': {
        target: 'https://yts-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
