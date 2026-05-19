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
