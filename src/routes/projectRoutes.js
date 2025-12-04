import express from 'express';
import { create, getAll, getDetail } from '../controllers/projectController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API quản lý dự án
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Tạo dự án mới
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Tạo dự án thành công
 *       500:
 *         description: Lỗi tạo dự án
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', create);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lấy danh sách dự án
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', getAll);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Lấy chi tiết 1 dự án
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy dự án (PROJECT_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/:id', getDetail);

export default router;
