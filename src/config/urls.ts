export const API_BASE_URL = 'http://192.168.1.34:5001';
export const getApiUrl = (endpoint: string) => API_BASE_URL + endpoint;

export const HOME = getApiUrl('/character');
