//================== API BASE URL =======================
export const API_BASE_URL = 'http://192.168.1.34:5001';
//================== GET API URL =======================

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

//================== SERVICE ROUTES =======================

export const SERVICE_ROUTES = {
  LOGIN: getApiUrl('/api/auth/login'),
  SIGN_UP: getApiUrl('/api/auth/signup'),
  SEND_OTP: getApiUrl('/api/auth/send-otp'),
  VERIFY_OTP: getApiUrl('/api/auth/verify-otp'),
  REQUEST: getApiUrl('/api/ride/request'),
  ALL_RIDER_RIDES: getApiUrl('/api/ride/all-rider-rides'),
  ACCEPT_REJECT: getApiUrl('/api/ride/accept-reject'),
  CANCEL_RIDE: getApiUrl('/api/ride/cancel/:rideId'),
  GET_MESSAGES: getApiUrl('/api/chat/:rideId'),
  DRIVER_STATUS: getApiUrl('/api/driver/status/:driverId'),
  UPDATE_DRIVER_LOCATION: getApiUrl('/api/driver/location'),
  LOCATION_BACKGROUND: getApiUrl('/api/driver/location-background'),
  GET_PROFILE: getApiUrl('/api/user/profile'),
  UPDATE_PROFILE: getApiUrl('/api/user/profile'),
} as const;

//=================== METHODS ==============================

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  PATCH: 'PATCH',
} as const;

//=================== TYPES ==============================

export type MethodsType = (typeof METHODS)[keyof typeof METHODS];

export type ServiceRoutesType =
  (typeof SERVICE_ROUTES)[keyof typeof SERVICE_ROUTES];

//================== ReplaceUrl ======================

export const replaceUrl = (
  url: string,
  data: Record<string, string | number>,
): string => {
  const regex = new RegExp(':(' + Object.keys(data).join('|') + ')', 'g');

  return url.replace(regex, (_, key) => String(data[key]) || _);
};
