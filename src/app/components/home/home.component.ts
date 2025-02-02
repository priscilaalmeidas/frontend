import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '@/users/users.service';
import { WelcomeComponent } from '../welcome/welcome.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { switchMap } from 'rxjs';
import { User } from '@/models/user.model';
import { Ticket } from '@/models/ticke.model';
import { Contact } from '@/models/contact.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChatComponent,
    WelcomeComponent,
    UserFormComponent,
    ChatComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  ticket: Ticket = {} as Ticket;
  contact: Contact = {} as Contact;
  menuOpen: boolean = false;
  user: User = {} as User;
  tickets: Ticket[] = [];
  ticketId: string = '';
  userId: string = '';
  ticketsByAgent: Ticket[] = [];
  completedTickets: Ticket[] = [];

  localUser: any;
  typeForm: string = '';

  constructor(private readonly userService: UsersService) {}

  getDuration(ticket: Ticket): string {
    if (!ticket?.createdAt || !ticket?.updatedAt) return '';
    const start = new Date(ticket.createdAt);
    const end = new Date(ticket.updatedAt);
    const diff = Math.abs(end.getTime() - start.getTime());

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0 ? `${hours}h ${remainingMinutes}min` : `${minutes}min`;
  }

  ngOnInit() {
    // Obter as informações do usuário
    this.localUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (this.localUser?._id) {
      this.userService.getUserById(this.localUser._id).subscribe((userInfo) => {
        this.user = userInfo;
        this.userId = userInfo._id;
        if (this.userId) {
          this.loadTickets();
        }
      });
    } else {
      console.error('Usuário não encontrado no localStorage.');
    }
  }

  loadTickets() {
    this.userService.getTicketsByAgent(this.userId).subscribe((tickets) => {
      this.tickets = tickets;
    });

    this.userService
      .getTicketsByAgentAndStatus(this.userId, 'completed')
      .subscribe((tickets) => {
        this.completedTickets = tickets;
      });

    this.userService
      .getTicketsByAgentAndStatus(this.userId, 'in_progress')
      .subscribe((tickets) => {
        this.ticketsByAgent = tickets;
      });
  }

  logout() {
    this.userService.logout();
    window.location.href = '/login';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  openForm(type: string) {
    this.contact = {} as Contact;
    if (type === 'add') {
      this.typeForm = 'add';
    } else if (type === 'edit') {
      this.typeForm = 'edit';
    } else if (type === 'list') {
      this.typeForm = 'list';
    } else {
      this.typeForm = '';
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

  async openChat(ticketId: string): Promise<void> {
    this.typeForm = '';
    this.userService
      .getTicketById(ticketId)
      .pipe(
        switchMap((ticket) => {
          this.ticket = ticket;
          return this.userService.getContact(ticket.contact._id);
        })
      )
      .subscribe((contact) => {
        this.contact = contact;
      });
  }
}
