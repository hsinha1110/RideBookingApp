import React, { useCallback, useEffect, useState } from 'react';

import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { useHeaderHeight } from '@react-navigation/elements';

import { useDispatch } from 'react-redux';

import { useRoute } from '@react-navigation/native';

import { jwtDecode } from 'jwt-decode';

import WrapperContainer from '@/components/WrapperContainer';

import HeaderComp from '@/components/HeaderComp';

import { AppDispatch } from '@/redux/store';

import { getChatMessagesAsyncThunk } from '@/redux/thunk/thunk';

import socket from '@/utils/socket';

import { secureStorage } from '@/utils/secureStorage';

const ChatScreen = () => {
  //================================================
  // ROUTE
  //================================================

  const route = useRoute<any>();

  const { rideId } = route.params;

  //================================================
  // REDUX
  //================================================

  const dispatch = useDispatch<AppDispatch>();

  //================================================
  // STATES
  //================================================

  const [messages, setMessages] = useState<IMessage[]>([]);

  const [userId, setUserId] = useState('');

  //================================================
  // HEADER HEIGHT
  //================================================

  const headerHeight = useHeaderHeight();

  //================================================
  // GET CURRENT USER ID
  //================================================

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = await secureStorage.getItem('AUTH_TOKEN');

        if (!token) {
          return;
        }

        const decoded: any = jwtDecode(token);

        const currentUserId = decoded.id || decoded._id;

        setUserId(String(currentUserId));

        console.log(currentUserId, '======= CURRENT USER ID =======');
      } catch (error) {
        console.log(error, '======= TOKEN ERROR =======');
      }
    };

    getCurrentUser();
  }, []);

  //================================================
  // JOIN ROOM
  //================================================

  useEffect(() => {
    if (rideId) {
      socket.emit('join_ride', rideId);

      console.log(rideId, '======= JOIN RIDE =======');
    }

    return () => {
      socket.emit('leave_ride', rideId);
    };
  }, [rideId]);

  //================================================
  // RECEIVE MESSAGE
  //================================================

  useEffect(() => {
    const handleReceiveMessage = (message: any) => {
      console.log(message, '======= RECEIVE MESSAGE =======');

      const senderId = String(
        message.user?._id || message.senderId || message.userId,
      );

      console.log(senderId, '======= SENDER ID =======');

      const newMessage: IMessage = {
        _id: message._id || Math.random().toString(),

        text: message.text || message.message || '',

        createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),

        user: {
          _id: senderId,

          name: message.user?.name || message.senderName || 'User',

          avatar: message.user?.avatar || '',
        },
      };

      //================================================
      // APPEND MESSAGE
      //================================================

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [newMessage]),
      );
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  //================================================
  // GET OLD MESSAGES
  //================================================

  const getMessages = async () => {
    try {
      const result = await dispatch(
        getChatMessagesAsyncThunk({
          rideId,
        }),
      );

      const response: any = result.payload;

      console.log(response, '======= CHAT RESPONSE =======');

      const messagesArray =
        response?.messages || response?.data?.messages || [];

      const formattedMessages: IMessage[] = messagesArray.map((item: any) => {
        const senderId = String(item.user?._id || item.senderId || item.userId);

        return {
          _id: item._id || Math.random().toString(),

          text: item.text || item.message || '',

          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),

          user: {
            _id: senderId,

            name: item.user?.name || item.senderName || 'User',

            avatar: item.user?.avatar || '',
          },
        };
      });

      setMessages(formattedMessages.reverse());
    } catch (error) {
      console.log(error, '======= GET CHAT ERROR =======');
    }
  };

  //================================================
  // INITIAL API
  //================================================

  useEffect(() => {
    getMessages();
  }, []);

  //================================================
  // SEND MESSAGE
  //================================================

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const message = newMessages[0];

      socket.emit('send_message', {
        text: message.text,

        rideId,
      });

      console.log(message, '======= SEND MESSAGE =======');
    },
    [rideId],
  );

  //================================================
  // UI
  //================================================

  return (
    <WrapperContainer edges={['top', 'bottom']}>
      {/* HEADER */}

      <HeaderComp showBack title="Messages" />

      {/* CHAT */}

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: String(userId),
        }}
        keyboardAvoidingViewProps={{
          keyboardVerticalOffset: headerHeight,
        }}
      />
    </WrapperContainer>
  );
};

export default ChatScreen;
