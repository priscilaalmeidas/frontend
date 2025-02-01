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
  users: any[] = [];
  filteredUsers: any[] = [];
  user: any = {};
  selectedUser: any = null;

  constructor(private readonly userService: UsersService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = [...this.users];
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

  editUser(user: any): void {
    this.typeForm = 'edit';
    this.selectedUser = { ...user };
  }

  remove(user: any): void {
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

  updateUser(user: any): void {
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
    this.selectedUser = null;
    alert('Usuário atualizado com sucesso!');
  }

  editCancel(): void {
    this.selectedUser = null;
    console.log(this.typeForm);
  }

  onSubmit(form: any): void {
    this.userService.createUser(form.value).subscribe(() => {});
    alert('Usuário criado com sucesso!');
    this.user = {};
  }
}
