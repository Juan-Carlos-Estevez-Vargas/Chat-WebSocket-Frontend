import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client;
  connected: boolean = false;

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

}
