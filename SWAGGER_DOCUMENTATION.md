# Swagger/OpenAPI 3.0 Documentation

## Overview

Comprehensive API documentation using **swagger-jsdoc** with JSDoc comments directly in Express route files and centralized schema definitions in `swagger.js`.

## Files Updated

### 1. **src/swagger.js** (Central Configuration)

- Added comprehensive OpenAPI 3.0 specification
- Defined all reusable component schemas:
  - **User schemas**: User, UserResponse
  - **Project schemas**: Project, ProjectResponse
  - **Auth schemas**: AuthRegister, AuthLogin, AuthResponse
  - **Error schemas**: ErrorResponse, ValidationError
- Added JWT Bearer authentication scheme
- All error codes and responses documented with examples

### 2. **src/routes/userRoutes.js** (Users Endpoints)

```
POST   /users           - Tạo user mới
GET    /users           - Lấy danh sách tất cả users
GET    /users/{id}      - Lấy chi tiết user theo ID
PUT    /users/{id}      - Cập nhật thông tin user
DELETE /users/{id}      - Xóa user (trả lỗi nếu user không tồn tại)
```

**Error codes documented**:

- 400: Validation errors (missing required fields)
- 404: User not found (USER_NOT_FOUND)
- 500: Server errors

### 3. **src/routes/projectRoutes.js** (Projects Endpoints)

```
POST   /projects        - Tạo dự án mới (validates user owner exists)
GET    /projects        - Lấy danh sách dự án (with owner info)
GET    /projects/{id}   - Lấy chi tiết dự án (with owner info)
```

**Error codes documented**:

- 400: Validation errors (missing name or owner)
- 404: Project not found (PROJECT_NOT_FOUND)
- 500: Server errors (User không tồn tại)

### 4. **src/routes/authRoutes.js** (Authentication Endpoints)

```
POST   /auth/register   - Đăng ký tài khoản mới
POST   /auth/login      - Đăng nhập (trả JWT Token)
GET    /auth/me         - Lấy thông tin user hiện tại (requires JWT)
```

**Error codes documented**:

- 400: Validation errors
- 401: Invalid credentials (INVALID_CREDENTIALS) hoặc No token (NOT_AUTHORIZED, TOKEN_INVALID)
- 500: Server errors

## Schema Documentation

### User Schema

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 20,
  "role": "user",
  "password": "hashed_password",
  "createdAt": "2025-12-05T12:00:00Z",
  "updatedAt": "2025-12-05T12:00:00Z"
}
```

### Project Schema

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "My Awesome Project",
  "description": "Project description",
  "status": "in-progress",
  "owner": "507f1f77bcf86cd799439011",
  "startDate": "2025-12-05T12:00:00Z",
  "createdAt": "2025-12-05T12:00:00Z",
  "updatedAt": "2025-12-05T12:00:00Z"
}
```

### Auth Response Schema

```json
{
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    }
  },
  "statusCode": 200
}
```

## Error Codes

### Authentication Errors

- `EMAIL_EXIST`: Email đã tồn tại khi đăng ký
- `INVALID_CREDENTIALS`: Email hoặc mật khẩu không đúng
- `NOT_AUTHORIZED`: Chưa đăng nhập (không có token)
- `TOKEN_INVALID`: Token không hợp lệ hoặc đã hết hạn

### Resource Errors

- `USER_NOT_FOUND`: User không tồn tại
- `PROJECT_NOT_FOUND`: Project không tồn tại

### Validation Errors

- Các lỗi validation Mongoose (missing required fields, invalid format, etc.)

## How to Use

1. **Start the server**:

   ```bash
   npm start
   ```

2. **Access Swagger UI**:
   Navigate to `http://localhost:3001/api-docs`

3. **Test endpoints**:
   - Click on any endpoint
   - Click "Try it out"
   - Fill in parameters/body
   - Click "Execute"

## Authentication with JWT

To use protected endpoints (like `/auth/me`):

1. Call `/auth/login` or `/auth/register` to get token
2. Copy the `token` from response
3. In Swagger UI, click "Authorize" button at top
4. Paste token in format: `Bearer <token>`
5. Now protected endpoints are accessible

## Documentation Standards

Each endpoint includes:

- ✅ Summary and description
- ✅ Request body with examples
- ✅ Path/query parameters
- ✅ Response schemas (200, 4xx, 5xx)
- ✅ Error codes and messages
- ✅ Security requirements (if needed)
- ✅ Real examples from actual code

## Benefits of This Approach

1. **Single Source of Truth**: Documentation lives with code
2. **Maintainable**: JSDoc comments stay with routes
3. **Auto-generated**: swagger-jsdoc scans files automatically
4. **Interactive**: Swagger UI allows testing
5. **Complete**: All error codes and edge cases documented
