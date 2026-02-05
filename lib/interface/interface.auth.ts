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

