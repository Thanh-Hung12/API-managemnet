import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// Hàm utility: Tạo Access Token và Refresh Token
export const generateToken = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
  
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );
  
  return { accessToken, refreshToken };
};

// 1. Đăng ký người dùng mới
export const register = async (name, email, password, role) => {
  // Kiểm tra email có tồn tại hay không
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("Email đã tồn tại");
  }

  // Tạo user mới (password sẽ được hash tự động bởi mongoose middleware)
  const newUser = await User.create({
    name,
    email,
    password,
    role, // role mặc định sẽ là 'user' nếu model quy định, hoặc do FE gửi lên
  });
  
  return newUser;
};

// 2. Đăng nhập
export const login = async (email, password) => {
  // Kiểm tra email có tồn tại hay không
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  // Kiểm tra password có đúng hay không
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }

  // Tạo bộ token
  const tokens = generateToken(user._id);

  // Lưu refresh token vào DB để quản lý phiên đăng nhập
  await User.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken,
  });

  return {
    tokens,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// 3. Refresh Token (Cấp lại Access Token mới)
export const refreshToken = async (refreshTokenFromCookie) => {
  // Kiểm tra refresh token có tồn tại hay không
  if (!refreshTokenFromCookie) {
    throw new Error("Refresh token không tồn tại");
  }

  let decoded;
  try {
    // Verify token
    decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (error) {
    throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
  }

  // Check trong DB xem token này còn hiệu lực (khớp với DB) không
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== refreshTokenFromCookie) {
    throw new Error("Refresh token không hợp lệ");
  }

  // Tạo access token mới
  const newAccessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRE,
    }
  );

  return {
    accessToken: newAccessToken,
  };
};

// 4. Logout
export const logout = async (userId) => {
  // Xóa refresh token trong DB
  await User.findByIdAndUpdate(userId, {
    refreshToken: "", // Hoặc null
  });
};

// 5. Lấy danh sách tất cả users (Dành cho Admin hoặc test)
export const getAllUsers = async () => {
  const users = await User.find().select("-password"); // Không trả về password
  return users;
};

// 6. Cập nhật Refresh Token
export const updateRefreshToken = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: refreshToken,
  });
};

// 7. Cập nhật thông tin user
export const updateUser = async (userId, name, email, role) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User không tồn tại");
  }

  // Chuẩn bị dữ liệu update
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;

  // Sử dụng findByIdAndUpdate
  // { new: true } để trả về data sau khi update
  // { runValidators: true } để đảm bảo validate theo schema
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select("-password");

  return updatedUser;
};
