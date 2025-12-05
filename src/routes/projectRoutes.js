import express from 'express';
import { create, getAll, getDetail } from '../controllers/projectController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: API quản lý dự án (CRUD operations)
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Tạo dự án mới
 *     tags: [Projects]
 *     description: Tạo một dự án mới. Owner (user tạo dự án) bắt buộc phải tồn tại.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, owner]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Awesome Project"
 *               description:
 *                 type: string
 *                 example: "This is a project description"
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 default: "pending"
 *                 example: "pending"
 *               owner:
 *                 type: string
 *                 description: MongoDB ObjectId của user tạo dự án
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Tạo dự án thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo dự án thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *       400:
 *         description: Dữ liệu không hợp lệ (missing name or owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Lỗi server - User không tồn tại hoặc validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi tạo dự án"
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 errorCode:
 *                   type: string
 *                   example: "User không tồn tại"
 */
router.post('/', create);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lấy danh sách tất cả dự án
 *     tags: [Projects]
 *     description: Lấy danh sách tất cả dự án (có populate thông tin owner)
 *     responses:
 *       200:
 *         description: Thành công - Trả về mảng project kèm thông tin owner
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   owner:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAll);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Lấy chi tiết 1 dự án
 *     tags: [Projects]
 *     description: Lấy thông tin chi tiết của một dự án cụ thể (kèm thông tin owner)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId của project
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Thành công - Trả về project detail với thông tin owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy chi tiết thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       404:
 *         description: Không tìm thấy dự án (PROJECT_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy dự án"
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 errorCode:
 *                   type: string
 *                   example: "PROJECT_NOT_FOUND"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getDetail);

export default router;
