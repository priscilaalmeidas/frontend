import { Contact } from '@/models/contact.model';
import { User } from '@/models/user.model';
import { UsersService } from '@/users/users.service';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  @Input() typeForm: string = '';
  currentSection: string = '';
  user_id: string = '';
  users: User[] = [];
  filteredUsers: User[] = [];
  user: User = {} as User;
  contacts: Contact[] = [];
  selectedUser: User = {} as User;

  constructor(private readonly userService: UsersService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = [...this.users];
    });
    this.userService.getAllContact().subscribe((contact) => {
      this.contacts = contact;
    });
  }

  getUserByName(name: string) {
    if (!name) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  setSection(section: string): void {
    this.currentSection = section;
  }

  editUser(user: User): void {
    this.typeForm = 'edit';
    this.selectedUser = { ...user };
  }

  remove(user: User): void {
    this.userService.delete(user._id).subscribe(
      () => {
        this.users = this.users.filter((u) => u._id !== user._id);
        this.filteredUsers = this.filteredUsers.filter(
          (u) => u._id !== user._id
        );
      },
      (error) => {
        console.error('Erro ao excluir o usuário', error);
      }
    );
    alert('Usuário removido com sucesso!');
  }

  updateUser(user: User): void {
    this.userService.updateUser(user._id, user).subscribe(
      () => {
        this.users = this.users.map((u) => (u._id === user._id ? user : u));
        this.filteredUsers = this.filteredUsers.map((u) =>
          u._id === user._id ? user : u
        );
      },
      (error) => {
        console.error('Erro ao atualizar o usuário', error);
      }
    );
    this.selectedUser = {} as User;
    alert('Usuário atualizado com sucesso!');
  }

  editCancel(): void {
    this.selectedUser = {} as User;
  }

  onSubmit(form: any): void {
    this.userService.createUser(form.value).subscribe(() => {});
    alert('Usuário criado com sucesso!');
    this.user = {} as User;
  }
}
