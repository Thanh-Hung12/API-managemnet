import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

const connectDB = async () => {
  try {
    // Kết nối DB với đường dẫn lấy từ file .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1); // Thoát chương trình nếu lỗi
  }
};

export default connectDB;