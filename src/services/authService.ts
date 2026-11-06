import { apiClient } from './apiClient';
import {
  ApiResponse,
  LoginInitiateRequest,
  LoginInitiateData,
  LoginVerifyOtpRequest,
  LoginVerifyOtpData,
  LoginResendOtpRequest,
  LoginResendOtpData,
  RegisterInitiateRequest,
  RegisterInitiateData,
  RegisterVerifyOtpRequest,
  RegisterVerifyOtpData,
  RegisterResendOtpRequest,
  RegisterResendOtpData,
  ForgotPasswordRequest,
  ForgotPasswordData,
  ResetPasswordRequest,
  ForgotResendOtpRequest,
  ForgotResendOtpData,
  RefreshTokenRequest,
  RefreshTokenData,
  GetMeData,
  ChangePasswordRequest,
} from '../types/auth';

/**
 * Phân hệ Xác thực & Phiên làm việc (Authentication - /auth)
 * Base URL: http://localhost:8080/nextgen/api/v1
 */
export const authService = {
  /**
   * API 1: POST /nextgen/api/v1/auth/login-initiate
   * Kiểm tra tài khoản + mật khẩu; gửi OTP về SMS (nếu nhập SĐT) hoặc Email (nếu nhập Email)
   */
  async loginInitiate(payload: LoginInitiateRequest): Promise<ApiResponse<LoginInitiateData>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginInitiateData>>('/auth/login-initiate', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Không thể kết nối tới máy chủ Backend (http://localhost:8080/nextgen/api/v1)',
      };
    }
  },

  /**
   * API 2: POST /nextgen/api/v1/auth/login-verify-otp
   * Xác thực 6 số OTP; cấp JWT Token; đồng bộ giỏ hàng
   */
  async loginVerifyOtp(payload: LoginVerifyOtpRequest): Promise<ApiResponse<LoginVerifyOtpData>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginVerifyOtpData>>('/auth/login-verify-otp', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi xác thực mã OTP',
      };
    }
  },

  /**
   * API 3: POST /nextgen/api/v1/auth/login-resend-otp
   * Gửi lại mã OTP đăng nhập khi hết 60s cooldown
   */
  async loginResendOtp(payload: LoginResendOtpRequest): Promise<ApiResponse<LoginResendOtpData>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResendOtpData>>('/auth/login-resend-otp', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi gửi lại mã OTP đăng nhập',
      };
    }
  },

  /**
   * API 4: POST /nextgen/api/v1/auth/register-initiate
   * Kiểm tra trùng Email/Phone; gửi OTP kích hoạt về Email
   */
  async registerInitiate(payload: RegisterInitiateRequest): Promise<ApiResponse<RegisterInitiateData>> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterInitiateData>>('/auth/register-initiate', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi khởi tạo đăng ký tài khoản',
      };
    }
  },

  /**
   * API 5: POST /nextgen/api/v1/auth/register-verify-otp
   * Khớp OTP; lưu User mới vào DB; tạo giỏ hàng Carts; gửi thông báo chào mừng
   */
  async registerVerifyOtp(payload: RegisterVerifyOtpRequest): Promise<ApiResponse<RegisterVerifyOtpData>> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterVerifyOtpData>>('/auth/register-verify-otp', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi xác thực kích hoạt tài khoản',
      };
    }
  },

  /**
   * API 6: POST /nextgen/api/v1/auth/register-resend-otp
   * Gửi lại mã OTP kích hoạt tài khoản về Email
   */
  async registerResendOtp(payload: RegisterResendOtpRequest): Promise<ApiResponse<RegisterResendOtpData>> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResendOtpData>>('/auth/register-resend-otp', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi gửi lại mã OTP kích hoạt',
      };
    }
  },

  /**
   * API 7: POST /nextgen/api/v1/auth/forgot-password
   * Nhận SĐT/Email; kiểm tra tồn tại; gửi OTP khôi phục mật khẩu
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordData>> {
    try {
      const response = await apiClient.post<ApiResponse<ForgotPasswordData>>('/auth/forgot-password', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi yêu cầu khôi phục mật khẩu',
      };
    }
  },

  /**
   * API 8: POST /nextgen/api/v1/auth/reset-password
   * Xác thực OTP; cập nhật password_hash mới; ghi nhật ký kiểm toán
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/auth/reset-password', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi đặt lại mật khẩu mới',
      };
    }
  },

  /**
   * API 9: POST /nextgen/api/v1/auth/forgot-resend-otp
   * Gửi lại mã OTP khôi phục mật khẩu
   */
  async forgotResendOtp(payload: ForgotResendOtpRequest): Promise<ApiResponse<ForgotResendOtpData>> {
    try {
      const response = await apiClient.post<ApiResponse<ForgotResendOtpData>>('/auth/forgot-resend-otp', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi gửi lại mã OTP khôi phục',
      };
    }
  },

  /**
   * API 10: POST /nextgen/api/v1/auth/refresh-token
   * Cấp mới accessToken khi token cũ hết hạn (silent refresh)
   */
  async refreshToken(payload: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenData>> {
    try {
      const response = await apiClient.post<ApiResponse<RefreshTokenData>>('/auth/refresh-token', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi làm mới phiên làm việc',
      };
    }
  },

  /**
   * API 11: POST /nextgen/api/v1/auth/logout
   * Hủy phiên làm việc; vô hiệu hóa Refresh Token và Access Token (Redis Blacklist)
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: true,
        statusCode: 200,
        message: 'Đăng xuất tài khoản thành công',
      };
    }
  },

  /**
   * API 12: GET /nextgen/api/v1/auth/me
   * Lấy profile người dùng hiện tại + địa chỉ mặc định từ Bearer Token
   */
  async getMe(): Promise<ApiResponse<GetMeData>> {
    try {
      const response = await apiClient.get<ApiResponse<GetMeData>>('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi lấy thông tin tài khoản hiện tại',
      };
    }
  },

  /**
   * API 13: PUT /nextgen/api/v1/auth/change-password
   * Đổi mật khẩu trực tiếp khi đã đăng nhập (Authorization: Bearer <accessToken>)
   */
  async changePassword(payload: ChangePasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.put<ApiResponse<null>>('/auth/change-password', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.message || 'Lỗi đổi mật khẩu',
      };
    }
  },
};
