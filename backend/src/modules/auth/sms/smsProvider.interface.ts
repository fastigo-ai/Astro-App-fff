export interface SendOtpResult {
  success: boolean;
  message: string;
  devOtp?: string;
  provider?: string;
}

export interface VerifyOtpResult {
  valid: boolean;
  message?: string;
}

export interface ISmsProvider {
  name: string;
  sendOtp(phone: string, otp: string): Promise<SendOtpResult>;
  verifyOtp(phone: string, otp: string): Promise<VerifyOtpResult>;
}
