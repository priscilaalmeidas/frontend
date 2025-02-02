import { Contact } from '@/models/contact.model';
import { Ticket } from '@/models/ticke.model';
import { UsersService } from '@/users/users.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  @ViewChild('finishChatModal') modalElement!: ElementRef;
  @Input() tickets: Ticket[] = [];
  @Input() ticket!: Ticket;
  @Input() contact!: Contact;
  messages = [{ text: 'Preciso de ajuda com meu pedido.', type: 'received' }];
  newMessage = '';
  contactClient: Contact = {} as Contact;
  editingContact = false;

  @ViewChild('chatBox') chatBox!: ElementRef;
  constructor(
    private readonly userService: UsersService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  getUserInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(/\s+/);
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
    const secondInitial =
      nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstInitial + secondInitial;
  }
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

  finishChat() {
    this.messages.push({
      text: 'A Positivo S+ agradece a atenção, até mais!',
      type: 'sent',
    });
    setTimeout(() => this.scrollToBottom(), 10);
  }

  updateTicket(ticket: Ticket, status: 'in_progress' | 'completed'): void {
    this.userService
      .updateTicket(ticket._id, { ...ticket, status })
      .subscribe(() => {
        ticket.status = status;
      });
  }

  updateContact(contact: Contact): void {
    this.contactClient = contact;
    this.userService
      .updateContact(this.contactClient._id, this.contactClient)
      .subscribe({
        next: () => {
          this.editingContact = false;
        },
        error: (error) => {
          console.error('Erro ao atualizar o contato:', error);
        },
      });
    this.editingContact = false;
    this.cdr.detectChanges();
  }
}
