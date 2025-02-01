import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '@/users/users.service';
import { WelcomeComponent } from '../welcome/welcome.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChatComponent,
    WelcomeComponent,
    UserFormComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  menuOpen: boolean = false;
  user: any;
  tickets: any[] = [];
  userId: string = '';
  status: string = 'in_progress';
  ticketsByAgent: any[] = [];
  contact: { id: string; name?: string; email?: string; phone?: string } = {
    id: '',
    name: '',
    email: '',
    phone: '',
  };
  localUser: any;
  typeForm: string = '';

  constructor(private readonly userService: UsersService) {}

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
      .getTicketsByAgentAndStatus(this.userId, this.status)
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
    if (type === 'add') {
      this.typeForm = 'add';
    } else {
      this.typeForm = 'edit';
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

  openChat() {
    console.log('Abrindo chat...');
  }
}
