import * as authService from '../services/authService.js';
import { success, error } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    return success(res, 'Đăng ký thành công', newUser, 201);
  } catch (err) {
    return error(res, 'Lỗi hệ thống', 500, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    return success(res, 'Đăng nhập thành công', data);
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return error(res, 'Email hoặc mật khẩu không đúng', 401);
    }
    return error(res, 'Lỗi hệ thống', 500, err.message);
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