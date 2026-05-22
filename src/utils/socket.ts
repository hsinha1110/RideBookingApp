import { io } from 'socket.io-client';

import { secureStorage } from '@/utils/secureStorage';

const SOCKET_URL = 'http://192.168.1.34:5001';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],

  autoConnect: false,
});

//================================================
// CONNECT SOCKET
//================================================

export const connectSocket = async () => {
  try {
    const token = await secureStorage.getItem('AUTH_TOKEN');

    console.log(token, '======= TOKEN =======');

    if (!token) {
      console.log('TOKEN NOT FOUND');

      return;
    }

    // DISCONNECT OLD

    if (socket.connected) {
      socket.disconnect();
    }

    // AUTH

    socket.auth = {
      token,
    };

    console.log(socket.auth, '======= SOCKET AUTH =======');

    // CONNECT

    socket.connect();
  } catch (error) {
    console.log(error, 'SOCKET CONNECT ERROR');
  }
};

socket.on('connect', () => {
  console.log('======= SOCKET CONNECTED =======');
});

socket.on('connect_error', error => {
  console.log(error.message, '======= SOCKET ERROR =======');
});

export default socket;
