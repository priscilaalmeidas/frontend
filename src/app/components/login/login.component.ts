import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '@/users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private authService: UsersService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.setSession(response.access_token, response.user);
        this.router.navigate(['/home']); // Redireciona para a home após login
      },
      error: () => {
        this.loginFailed = true;
      },
    });
  }
  logout() {
    this.authService.logout();
  }
}
