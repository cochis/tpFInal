export interface ChatMessage {
    from: 'user' | 'bot';
    text: string;
    timestamp: number;
    /**
     * (Opcional) Si este mensaje viene con un menú,
     * el frontend lo usará para renderizar botones.
     */
    menu?: { key: string, text: string }[];
}