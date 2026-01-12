import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("ไม่สามารถหา Element #root เพื่อแสดงผลแอปพลิเคชันได้");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเริ่มต้น React App:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2 style="color: #ef4444;">เกิดข้อผิดพลาดในการโหลดระบบ</h2>
        <p>กรุณารีเฟรชหน้าจออีกครั้ง หรือตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</p>
        <pre style="text-align: left; background: #f3f4f6; padding: 10px; border-radius: 8px; font-size: 12px; overflow: auto;">${error}</pre>
      </div>
    `;
  }
}