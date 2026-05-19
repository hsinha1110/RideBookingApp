//============ Async Routes ============================

export const ASYNC_ROUTES = {
  LOGIN: 'login',
  SIGN_UP: 'signup',
  SEND_OTP: 'sendOtp',
  VERIFY_OTP: 'verifyOtp',
  REQUEST: 'request',
  ALL_RIDER_RIDES: 'allRiderRides',
  ACCEPT_REJECT: 'acceptReject',
  CANCEL_RIDE: 'cancelRide',
  GET_MESSAGES: 'getMessages',
} as const;

//==================== Thunk Status =====================

export const THUNK_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

//==================== Types =====================

export type AsyncRoutesType = (typeof ASYNC_ROUTES)[keyof typeof ASYNC_ROUTES];

export type ThunkStatusType = (typeof THUNK_STATUS)[keyof typeof THUNK_STATUS];
