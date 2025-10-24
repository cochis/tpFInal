import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client'; // <--- Importamos io y Socket
import { environment } from 'src/environments/environment'; // Asumimos que tienes 'environment.ts'
import { ChatMessage } from '../core/models/chat.model';

// Definimos cómo se ve la respuesta del endpoint /updates
interface UpdateResponse {
  messages: ChatMessage[];
}
@Injectable({
  providedIn: 'root'
})
export class BotService {

  private socket: Socket;
  private readonly socketUrl = environment.socketUrl; // (ej: 'http://localhost:3000')

  // Variable temporal para guardar el userId
  private tempUserId: string | null = null;

  constructor() {
    this.socket = io(this.socketUrl, {
      autoConnect: false // No conectar automáticamente
    });

    // --- CAMBIO IMPORTANTE: Lógica de Conexión ---
    /**
     * Escuchamos el evento 'connect' del PROPIO SOCKET.
     * Esto nos asegura que la conexión está establecida.
     */
    this.socket.on("connect", () => {
      console.log(`✅ CONECTADO al socket con ID: ${this.socket.id}`);

      // AHORA que estamos conectados, le pedimos el menú al backend
      if (this.tempUserId) {
        // Usamos el nuevo evento 'solicitar-bienvenida'
        this.socket.emit('solicitar-bienvenida', { userId: this.tempUserId });
        this.tempUserId = null; // Limpiamos la variable
      }
    });

    // (Tus otros logs de 'disconnect' y 'connect_error' se quedan igual)
    this.socket.on("disconnect", (reason) => {
      console.warn(`❌ DESCONECTADO del socket: ${reason}`);
    });
    this.socket.on("connect_error", (err) => {
      console.error(`Error de conexión de Socket: ${err.message}`);
    });
  }

  /**
   * (MODIFICADO) Inicia la conexión del socket
   */
  connect(userId: string): void {
    if (!this.socket.connected) {
      // Guardamos el userId temporalmente
      this.tempUserId = userId;
      // Inicia la conexión (esto disparará el listener 'connect' de arriba)
      this.socket.connect();
    } else {
      // Si ya estaba conectado (raro, pero posible), solo pide el menú
      this.socket.emit('solicitar-bienvenida', { userId: userId });
    }
  }

  /**
   * Cierra la conexión del socket
   */
  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  /**
   * Emite una OPCIÓN DE MENÚ al backend. (Sin cambios)
   */
  sendMenuOption(option: { key: string, text: string }): void {
    this.socket.emit('enviar-opcion', option);
  }

  /**
   * Escucha eventos del backend. (Sin cambios)
   */
  listen(eventName: string): Observable<ChatMessage> {
    return new Observable((subscriber: Subscriber<ChatMessage>) => {

      this.socket.on(eventName, (data: ChatMessage) => {
        subscriber.next(data);
      });

      this.socket.on('disconnect', () => {
        subscriber.complete();
      });
    });
  }
}