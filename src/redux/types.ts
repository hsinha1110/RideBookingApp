export interface SignUpPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ErrorResponse {
  message: string;
}

export interface loginPayload {
  phoneNumber: string;
}

export interface sendOtpPayload {
  phoneNumber: string;
}
export interface VerifyOtpResponse {
  user: {
    _id: string;
    fullName?: string;
  };
  token: string;
  riderId?: string;
}