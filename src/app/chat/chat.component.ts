import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from './models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client;
  public connected: boolean = false;
  public messages: Message[] = [];
  public message: Message = new Message();

  constructor() { }

  ngOnInit(): void {
    this.client = new Client();

    /**
     * Se encarga de añadir el SockJS al Stomp con el broker de mensajería
     */
    this.client.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket");
    };

    /**
     * Conecta al usuario al chat
     */
    this.client.onConnect = (frame) => {
      this.connected = true;

      this.client.subscribe('/chat/messages', e => {
        let message: Message = JSON.parse(e.body) as Message;
        message.date = new Date(message.date);
        this.messages.push(message);
      });

      this.message.type = "NEW_USER";
      this.client.publish({ destination: '/app/message', body: JSON.stringify(this.message) });
    }

    /**
     * Desconecta el usuario del chat
     */
    this.client.onDisconnect = (frame) => {
      this.connected = false;
    }

  }

  /**
   * Activa la conexión con el broker de mensajería
   */
  connect(): void {
    this.client.activate();
  }

  /**
   * Desactiva la conexión con el broker de mensajería
   */
  unconnect(): void {
    this.client.deactivate();
  }

  sendMessage(): void {
    this.message.type = "MESSAGE";
    this.client.publish({ destination: '/app/message', body: JSON.stringify(this.message) });
    this.message.text = '';
  }
}
