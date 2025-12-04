import User from '../models/userModel.js'; 
// ⚠️ LƯU Ý QUAN TRỌNG: Trong Node.js, import file nội bộ BẮT BUỘC phải có đuôi .js

// 1. Tạo User
export const createUser = async (userData) => {
  const newUser = await User.create(userData);
  return newUser;
};

// 2. Lấy tất cả User
export const getAllUsers = async () => {
  return await User.find();
};

// 3. Lấy 1 User theo ID
export const getUserById = async (userId) => {
  return await User.findById(userId);
};

// 4. Cập nhật User
export const updateUser = async (userId, updateData) => {
  // { new: true } để trả về dữ liệu mới sau khi update
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

// 5. Xóa User
export const deleteUser = async (userId) => {
  // Kiểm tra xem user có tồn tại không
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User không tồn tại');
  }
  return await User.findByIdAndDelete(userId);
};