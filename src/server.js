import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Nhớ đuôi .js
import userRoutes from './routes/userRoutes.js'; // Nhớ đuôi .js
import projectRoutes from './routes/projectRoutes.js';
import { swaggerDocs } from "./swagger.js";
import authRoutes from './routes/authRoutes.js'; 
import cors from 'cors';


// Load biến môi trường
dotenv.config();

const app = express();

app.use(cors(
  {
    origin: '*'
  }
));

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
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});