import { Contact } from '@/models/contact.model';
import { Message } from '@/models/message.model';
import { Ticket } from '@/models/ticke.model';
import { UsersService } from '@/users/users.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  @Input() messagesChatId: Message[] = [];
  @Output() chatFinished = new EventEmitter<Ticket>();
  messages: Message[] = [];
  newMessageContact = '';
  newMessageUser = '';
  contactClient: Contact = {} as Contact;
  editingContact = false;
  userId: string = '';

  @ViewChild('chatBox') chatBox!: ElementRef;
  constructor(
    private readonly userService: UsersService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getUser()._id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket'] && this.ticket._id) {
      this.loadMessages();
    }
  }

  getUserInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(/\s+/);
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
    const secondInitial =
      nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstInitial + secondInitial;
  }

  loadMessages(): void {
    this.userService
      .getMessagesByChatId(this.ticket._id)
      .subscribe((messages) => {
        this.messages = messages;
        this.scrollToBottom();
      });
  }

  sendMessage(idOrName: string, sender: string): void {
    let newMessage =
      sender === 'user' ? this.newMessageUser : this.newMessageContact;
    if (newMessage.trim()) {
      this.userService
        .sendMessage(idOrName, newMessage, this.ticket._id)
        .subscribe(() => {
          this.messages.push({
            message: newMessage,
            sender: idOrName,
            chatId: this.ticket._id,
            timestamp: new Date().toString(),
          });

          if (sender === 'user') {
            this.newMessageUser = '';
          } else {
            this.newMessageContact = '';
          }
          this.loadMessages();
          setTimeout(() => this.scrollToBottom(), 10);
        });
    }
  }

  scrollToBottom() {
    const chatBox = this.chatBox.nativeElement;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  finishChat() {
    this.messages.push({
      message: 'A Positivo S+ agradece a atenção, até mais!',
      sender: this.userId,
      chatId: this.ticket._id,
      timestamp: new Date().toString(),
    });
    setTimeout(() => this.scrollToBottom(), 10);
  }

  updateTicket(ticket: Ticket, status: 'in_progress' | 'completed'): void {
    this.userService
      .updateTicket(ticket._id, { ...ticket, status })
      .subscribe(() => {
        ticket.status = status;
      });
    const updatedTicket = {
      ...this.ticket,
      status: status,
    };
    this.chatFinished.emit(updatedTicket);
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
