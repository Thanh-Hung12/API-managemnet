import express from "express";
import { create, getAll, getDetail, update, remove } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API quản lý người dùng (CRUD operations)
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo user mới
 *     tags: [Users]
 *     description: Tạo một người dùng mới với thông tin name, email, age
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               age:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Tạo user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo user thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ (missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Lỗi server - Validation failed hoặc duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả user
 *     tags: [Users]
 *     description: Lấy danh sách toàn bộ người dùng trong hệ thống
 *     responses:
 *       200:
 *         description: Thành công - Trả về mảng user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy chi tiết user theo ID
 *     tags: [Users]
 *     description: Lấy thông tin chi tiết của một user cụ thể
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId của user
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy user"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getDetail);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật thông tin user
 *     tags: [Users]
 *     description: Cập nhật thông tin của user (name, email, age, ...)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user cần cập nhật
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               age:
 *                 type: number
 *                 example: 25
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi server (duplicate email, validation error, etc)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa user theo ID
 *     tags: [Users]
 *     description: Xóa một user khỏi hệ thống. Nếu user không tồn tại, sẽ trả về lỗi.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user cần xóa
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa thành công"
 *       404:
 *         description: User không tồn tại (không thể xóa lần 2)
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User không tồn tại"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", remove);

export default router;