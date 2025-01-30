import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  login() {
    // Simulação de login: verifica se o usuário e a senha são corretos
    if (this.username === 'admin' && this.password === '1234') {
      this.loginFailed = false;
      alert('Login realizado com sucesso!');
    } else {
      this.loginFailed = true;
    }
  }
}
