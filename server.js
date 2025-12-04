import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js'; // Nhớ đuôi .js
import userRoutes from './src/routes/userRoutes.js'; // Nhớ đuôi .js
import projectRoutes from './src/routes/projectRoutes.js';
import { swaggerDocs } from "./src/swagger.js";



// Load biến môi trường
dotenv.config();

const app = express();

// Middleware quan trọng: Giúp Express hiểu được dữ liệu JSON
// Nếu thiếu dòng này, req.body sẽ bị undefined
app.use(express.json());

swaggerDocs(app);

// Kết nối Database
connectDB();

// Route gốc
// Mọi request bắt đầu bằng /api/users sẽ đi vào userRoutes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});