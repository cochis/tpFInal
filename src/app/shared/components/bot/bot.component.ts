import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/core/models/chat.model';
import { BotService } from 'src/app/services/bot.service';

@Component({
  standalone: false,
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;

  isChatOpen: boolean = false;
  messages: ChatMessage[] = []; // Almacena todos los mensajes (user y bot)

  // Almacena los botones a mostrar
  currentMenu: { key: string, text: string }[] = [];

  private userId: string = 'user_angular_client_001'; // (O ID del usuario logueado)
  private subscriptions = new Subscription();

  constructor(private chatbotService: BotService) { }

  ngOnInit(): void {
    // No hacemos nada hasta que el usuario abre el chat
  }

  ngOnDestroy(): void {
    // Limpieza al destruir el componente
    this.chatbotService.disconnect();
    this.subscriptions.unsubscribe();
  }

  ngAfterViewChecked(): void {
    // Auto-scroll al fondo cada vez que se añade un mensaje
    if (this.isChatOpen) {
      this.scrollToBottom();
    }
  }

  /**
   * Controla la apertura y cierre del modal
   */
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;

    if (this.isChatOpen) {
      // --- Al ABRIR el chat ---
      this.messages = []; // Limpiar chat anterior
      this.currentMenu = []; // Limpiar menú anterior
      this.chatbotService.connect(this.userId); // Conectar al socket

      // Escuchamos el evento 'mensaje-nuevo'
      const chatSub = this.chatbotService.listen('mensaje-nuevo')
        .subscribe((newMessage: ChatMessage) => {

          // 1. Añadir el mensaje de texto del bot a la lista
          this.messages.push(newMessage);

          // 2. Revisar si ESE mensaje (newMessage) trae un menú
          if (newMessage.menu && newMessage.menu.length > 0) {
            // ¡SÍ! Guardamos el menú para que el HTML lo muestre
            this.currentMenu = newMessage.menu;
          } else {
            // No, este mensaje no trajo menú (ej. es una respuesta simple)
            // Limpiamos el menú para que no se muestren botones.
            this.currentMenu = [];
          }
        });

      this.subscriptions.add(chatSub); // Guardamos la subscripción

    } else {
      // --- Al CERRAR el chat ---
      this.chatbotService.disconnect();
      this.subscriptions.unsubscribe();
      // Creamos una nueva instancia para la próxima vez que se abra
      this.subscriptions = new Subscription();
    }
  }

  /**
   * Se llama cuando el usuario presiona un botón del menú.
   */
  sendMenuOption(option: { key: string, text: string }): void {

    // 1. Mostrar la opción del usuario en la UI (feedback inmediato)
    const userMessage: ChatMessage = {
      from: 'user',
      text: option.text, // El texto del botón que clickeó
      timestamp: Math.floor(Date.now() / 1000)
    };
    this.messages.push(userMessage);

    // 2. Limpiar el menú actual (para que no pueda hacer doble clic)
    this.currentMenu = [];

    // 3. Enviar la 'key' de la opción al backend
    this.chatbotService.sendMenuOption(option);
  }

  /**
   * Función de Auto-scroll
   */
  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}