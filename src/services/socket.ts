import { SOCKET_EVENT_TYPE } from '@/constants/socket';
import { createEventBus } from '@/design/utils';
import { getToken } from '@/lib/utils/authority';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stomp = null;
let sock = null;

export const socketEventBus = createEventBus();

export const connectSocket = ({ address, sendChannel = '', notificationChannel }) => {
  sock = new SockJS(address);
  stomp = Stomp.over(sock);
  // sock.onopen = () => {
  //   this.print('sock:open');
  // };

  // sock.onmessage = e => {
  //   this.print('sock:message: ' + JSON.stringify(e.data));
  // };

  // sock.onclose = e => {
  //   this.print('sock:close');
  // };

  stomp.sendChannel = sendChannel;
  stomp.notificationChannel = notificationChannel;

  stomp.connect(
    'guest',
    'guest',
    frame => {
      stomp.subscribe(notificationChannel, message => {
        socketEventBus.emit(SOCKET_EVENT_TYPE, {
          data: message.body ? JSON.parse(message.body) : {},
        });
      });
    },
    error => {
      stomp.error = true;
      console.error(error);
    }
  );
};

export const disconnectSocket = () => {
  if (!stomp || stomp.error) return;
  try {
    stomp.disconnect();
  } catch (error) {
    console.error(error);
  }
};
