import Project from '../models/projectModel.js';
import * as userService from './userServices.js';

// 1. Tạo Project mới
export const createProject = async (data) => {
  // Kiểm tra xem user (owner) có tồn tại không
  if (data.owner) {
    const user = await userService.getUserById(data.owner);
    if (!user) {
      throw new Error('User không tồn tại');
    }
  }
  return await Project.create(data);
};

// 2. Lấy tất cả Project (Kèm thông tin người tạo)
export const getAllProjects = async () => {
  // .populate('owner') => Sẽ thay thế ID bằng thông tin user tương ứng
  // 'name email' => Chỉ lấy trường name và email của user đó (bỏ qua password, age...)
  return await Project.find().populate('owner', 'name email');
};

// 3. Lấy chi tiết Project
export const getProjectById = async (id) => {
  return await Project.findById(id).populate('owner', 'name email');
};

// 4. Update & Delete (Giống User)
export const updateProject = async (id, data) => {
  return await Project.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};