import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Swagger API cho User, Project và Authentication",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3001/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // ============ USER SCHEMAS ============
        User: {
          type: "object",
          required: ["name", "email"],
          properties: {
            _id: { 
              type: "string",
              description: "ID của user (MongoDB ObjectId)",
              example: "507f1f77bcf86cd799439011"
            },
            name: { 
              type: "string",
              description: "Tên người dùng",
              example: "John Doe"
            },
            email: { 
              type: "string",
              format: "email",
              description: "Email của người dùng (unique)",
              example: "john@example.com"
            },
            age: { 
              type: "number",
              default: 18,
              description: "Tuổi của người dùng",
              example: 20
            },
            password: {
              type: "string",
              description: "Mật khẩu (hash bcrypt, không trả về API)",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
              description: "Vai trò của người dùng",
            },
            createdAt: { 
              type: "string",
              format: "date-time",
              description: "Thời gian tạo",
            },
            updatedAt: { 
              type: "string",
              format: "date-time",
              description: "Thời gian cập nhật",
            },
          },
        },

        UserResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Tạo user thành công" },
            data: { $ref: "#/components/schemas/User" },
            statusCode: { type: "number", example: 201 },
          },
        },

        // ============ PROJECT SCHEMAS ============
        Project: {
          type: "object",
          required: ["name", "owner"],
          properties: {
            _id: { 
              type: "string",
              description: "ID của project",
              example: "507f1f77bcf86cd799439011"
            },
            name: { 
              type: "string",
              description: "Tên dự án",
              example: "My Awesome Project"
            },
            description: { 
              type: "string",
              description: "Mô tả dự án",
              example: "This is a project description"
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              default: "pending",
              description: "Trạng thái dự án",
              example: "in-progress"
            },
            startDate: { 
              type: "string",
              format: "date-time",
              description: "Ngày bắt đầu dự án",
            },
            owner: { 
              type: "string",
              description: "ID của user tạo dự án",
              example: "507f1f77bcf86cd799439011"
            },
            createdAt: { 
              type: "string",
              format: "date-time",
              description: "Thời gian tạo",
            },
            updatedAt: { 
              type: "string",
              format: "date-time",
              description: "Thời gian cập nhật",
            },
          },
        },

        ProjectResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Tạo dự án thành công" },
            data: { $ref: "#/components/schemas/Project" },
            statusCode: { type: "number", example: 201 },
          },
        },

        // ============ AUTH SCHEMAS ============
        AuthRegister: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { 
              type: "string",
              description: "Tên người dùng",
              example: "John Doe"
            },
            email: { 
              type: "string",
              format: "email",
              description: "Email của người dùng",
              example: "john@example.com"
            },
            password: { 
              type: "string",
              format: "password",
              minLength: 6,
              description: "Mật khẩu (tối thiểu 6 ký tự)",
              example: "password123"
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
              description: "Vai trò của người dùng",
              example: "user"
            },
          },
        },

        AuthLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { 
              type: "string",
              format: "email",
              example: "john@example.com"
            },
            password: { 
              type: "string",
              format: "password",
              example: "password123"
            },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            success: { 
              type: "boolean",
              description: "Trạng thái thành công",
              example: true
            },
            message: { 
              type: "string",
              description: "Thông báo",
              example: "Đăng nhập thành công" 
            },
            accessToken: { 
              type: "string",
              description: "JWT Access Token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzJkZmFjYWI3NTM1M2U5MTJhYjhlNSIsImlhdCI6MTc2NDk0MTc2MywiZXhwIjoxNzY1NTQ2NTYzfQ.XRPOZ2PrmmIhETC2Vj3S0omBcpKnJ7R5wGrxNn2Jf_s"
            },
            user: {
              type: "object",
              description: "Thông tin user",
              properties: {
                id: { 
                  type: "string",
                  example: "507f1f77bcf86cd799439011"
                },
                email: { 
                  type: "string",
                  example: "john@example.com"
                },
                name: { 
                  type: "string",
                  example: "John Doe"
                },
                role: { 
                  type: "string",
                  enum: ["user", "admin"],
                  example: "user"
                },
              },
            },
          },
        },

        // ============ ERROR RESPONSE SCHEMAS ============
        ErrorResponse: {
          type: "object",
          properties: {
            message: { 
              type: "string",
              description: "Mô tả lỗi",
              example: "Không tìm thấy user"
            },
            statusCode: { 
              type: "number",
              description: "HTTP Status Code",
              example: 404
            },
            errorCode: { 
              type: "string",
              description: "Error code để xác định lỗi chính xác",
              example: "NOT_FOUND"
            },
          },
        },

        ValidationError: {
          type: "object",
          properties: {
            message: { 
              type: "string",
              example: "Validation failed: email and name are required"
            },
            statusCode: { type: "number", example: 400 },
            errorCode: { 
              type: "string",
              example: "VALIDATION_ERROR"
            },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: { 
              type: "boolean",
              example: true
            },
            message: { 
              type: "string",
              example: "Thao tác thành công"
            },
            data: { 
              type: "object",
              description: "Dữ liệu được trả về (tùy thuộc vào endpoint)"
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"], // Quét tất cả JSDoc comments từ file route
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
