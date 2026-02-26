export type LoginAdminRequest = {
  email: string;
  password: string;
};

export type LoginAdminResponse = {
  message: string;
  email: string;
};



export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  access: string;  // JWT access token
  refresh: string; // JWT refresh token
  user: {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
  };
}


export interface ProfileData {
  can_manage_news: boolean;
  can_manage_users: boolean;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  date_joined: string;
  last_login: string;
  profile_data: ProfileData;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  profile_image?: File | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface PasswordResetConfirmRequest {
  email: string;
  otp: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}


