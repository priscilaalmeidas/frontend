import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  messages = [{ text: 'Preciso de ajuda com meu pedido.', type: 'received' }];

  newMessage = '';

  @ViewChild('chatBox') chatBox!: ElementRef;

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, type: 'sent' });
      this.newMessage = '';
      setTimeout(() => this.scrollToBottom(), 10);
    }
  }

  scrollToBottom() {
    const chatBox = this.chatBox.nativeElement;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
