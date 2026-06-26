import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from './auth';

const WS_URL = 'http://localhost:8081/ws';

/**
 * Thin wrapper around a STOMP-over-SockJS connection. Authenticates with the
 * JWT on CONNECT and delivers messages pushed to /user/queue/messages.
 */
class ChatSocket {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(onMessage, onStatus) {
    const token = getToken();
    if (!token || this.client) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: 'Bearer ' + token },
      reconnectDelay: 4000,
      onConnect: () => {
        this.connected = true;
        onStatus && onStatus(true);
        this.client.subscribe('/user/queue/messages', (frame) => {
          try { onMessage(JSON.parse(frame.body)); } catch { /* ignore */ }
        });
      },
      onWebSocketClose: () => { this.connected = false; onStatus && onStatus(false); },
      onStompError: () => { this.connected = false; onStatus && onStatus(false); },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      try { this.client.deactivate(); } catch { /* ignore */ }
      this.client = null;
      this.connected = false;
    }
  }
}

export default new ChatSocket();
