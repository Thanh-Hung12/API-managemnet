import express from 'express';
import { register, login, getMe, updateProfile, changePassword, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API xác thực người dùng (đăng ký, đăng nhập, quản lý profile)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     description: Tạo một tài khoản mới với email, mật khẩu và tên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng ký thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *       400:
 *         description: Dữ liệu không hợp lệ (missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Lỗi server - Email đã tồn tại hoặc lỗi khác
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi hệ thống"
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 errorCode:
 *                   type: string
 *                   example: "EMAIL_EXIST"
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Authentication]
 *     description: Đăng nhập với email và mật khẩu, trả về JWT Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ (missing email or password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Email hoặc mật khẩu không đúng (INVALID_CREDENTIALS)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email hoặc mật khẩu không đúng"
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *                 errorCode:
 *                   type: string
 *                   example: "INVALID_CREDENTIALS"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Authentication]
 *     description: Lấy thông tin của user đang đăng nhập (yêu cầu JWT Token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công - Trả về thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token không hợp lệ hoặc đã hết hạn"
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *                 errorCode:
 *                   type: string
 *                   enum: [NOT_AUTHORIZED, TOKEN_INVALID]
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Cập nhật profile user
 *     tags: [Authentication]
 *     description: Cập nhật thông tin profile của user hiện tại (name, email, age). Không cập nhật mật khẩu.
 *     security:
 *       - bearerAuth: []
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
 *         description: Cập nhật profile thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật profile thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Email đã tồn tại (EMAIL_EXIST) hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email đã tồn tại"
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 errorCode:
 *                   type: string
 *                   example: "EMAIL_EXIST"
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [Authentication]
 *     description: Đổi mật khẩu của user hiện tại. Yêu cầu mật khẩu cũ để xác thực.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "currentPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đổi mật khẩu thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     user:
 *                       type: object
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Mật khẩu cũ và mật khẩu mới là bắt buộc (MISSING_PASSWORD)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu cũ và mật khẩu mới là bắt buộc"
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 errorCode:
 *                   type: string
 *                   example: "MISSING_PASSWORD"
 *       401:
 *         description: Mật khẩu cũ không đúng (INVALID_PASSWORD) hoặc không có token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu cũ không đúng" | "Bạn chưa đăng nhập"
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *                 errorCode:
 *                   type: string
 *                   example: "INVALID_PASSWORD" | "NOT_AUTHORIZED"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/change-password', protect, changePassword);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Authentication]
 *     description: Đăng xuất tài khoản hiện tại. Token sẽ không còn hiệu lực (trong thực tế, cần implement token blacklist phía server).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng xuất thành công"
 *                 data:
 *                   type: "null"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', protect, logout);

export default router;