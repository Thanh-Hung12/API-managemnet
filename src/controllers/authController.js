import * as authService from '../services/authService.js';
import { success, error } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true, // Cookie chỉ đọc từ server, client không truy cập được → tăng bảo mật
  secure: false, // Để false khi chạy local. Lên production (HTTPS) thì set thành true
  sameSite: 'strict', // Giảm nguy cơ tấn công CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000 // Thời gian sống của cookie: 7 ngày
};
//đăng ký 
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await authService.register(name, email, password, role);
    
    // Tạo token cho user mới
    const tokens = authService.generateToken(newUser._id);
    
    // Lưu refreshToken vào cookie httpOnly
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
    
    // Lưu refresh token vào DB
    await authService.updateRefreshToken(newUser._id, tokens.refreshToken);
    
    // Trả về accessToken + thông tin user cho client
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      accessToken: tokens.accessToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
    
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Gọi service đăng nhập, trả về token + thông tin người dùng
    const { tokens, user } = await authService.login(email, password);

    // Lưu refreshToken vào cookie httpOnly
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);

    // Trả về accessToken + thông tin user cho client
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      accessToken: tokens.accessToken,
      user,
    });

  } catch (err) {
    return error(res, 'Lỗi hệ thống', 401, err.message);
  }
};
export const refresh = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const refreshTokenFromCookie = req.cookies.refreshToken;

    // Gọi service để tạo access token mới
    const tokens = await authService.refreshToken(refreshTokenFromCookie);

    res.status(200).json({
      message: "Lấy token mới thành công",
      accessToken: tokens.accessToken,
    });

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
export const logoutController = async (req, res) => {
  try {
    // Xóa refreshToken trong DB
    await logout(req.user._id);

    // Xóa cookie refreshToken trên browser
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Đăng xuất thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin user hiện tại
export const getMe = (req, res) => {
  // req.user đã có sẵn nhờ middleware 'protect'
  return success(res, 'Lấy thông tin thành công', req.user);
};

// Cập nhật profile của user
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, age } = req.body;

    // Không cho phép cập nhật mật khẩu ở endpoint này
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (age) updateData.age = age;

    const updatedUser = await authService.updateUserProfile(userId, updateData);
    return success(res, 'Cập nhật profile thành công', updatedUser);
  } catch (err) {
    if (err.message === 'EMAIL_EXIST') {
      return error(res, 'Email đã tồn tại', 400, 'EMAIL_EXIST');
    }
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return error(res, 'Mật khẩu cũ và mật khẩu mới là bắt buộc', 400, 'MISSING_PASSWORD');
    }

    const result = await authService.changeUserPassword(userId, oldPassword, newPassword);
    return success(res, 'Đổi mật khẩu thành công', result);
  } catch (err) {
    if (err.message === 'INVALID_PASSWORD') {
      return error(res, 'Mật khẩu cũ không đúng', 401, 'INVALID_PASSWORD');
    }
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
};

// Đăng xuất
export const logout = (req, res) => {
  return success(res, 'Đăng xuất thành công', null);
};