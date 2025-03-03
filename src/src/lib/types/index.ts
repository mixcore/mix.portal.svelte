export interface User {
    username: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    isAgreed?: boolean;
  }
  
  export interface LoginData {
    username: string;
    password: string;
    rememberMe: boolean;
  }
  
  export interface ForgotPasswordData {
    email: string;
  }
  
  export interface ResetPasswordData {
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
  }
  
  export interface ApiResponse<T = any> {
    isSucceed: boolean;
    errors?: string[];
    data?: T;
  }
  
  export interface AuthState {
    isAuth: boolean;
    isAdmin: boolean;
    username?: string;
    permissions?: string[];
    token?: string;
  }