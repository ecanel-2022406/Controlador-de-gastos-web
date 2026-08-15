import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <form class="login-card" (ngSubmit)="iniciarSesion()">
        <div class="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input type="email" [(ngModel)]="usuario.email" name="email" placeholder="nombre@ejemplo.com" required />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="usuario.password" name="password" placeholder="••••••••" required />
        </div>
        <button type="submit">Entrar</button>
        <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
      </form>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = {
    email: '',
    password: ''
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  iniciarSesion() {
    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        console.log('Login exitoso');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Credenciales incorrectas o error en el servidor');
      }
    });
  }
}