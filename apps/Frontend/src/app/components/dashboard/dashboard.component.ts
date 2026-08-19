import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 40px; text-align: center;">
      <h2>Panel de Control (Dashboard)</h2>
      <p>Has iniciado sesión correctamente.</p>
      <p style="color: red; font-weight: bold;">Tu sesión se cerrará automáticamente en cuanto el token venza...</p>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    this.validarTokenYExpiracion();
  }

  validarTokenYExpiracion() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      
      const expiracionMs = payloadDecoded.exp * 1000;
      const tiempoRestante = expiracionMs - Date.now();

      if (tiempoRestante <= 0) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      } else {

        setTimeout(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }, tiempoRestante);
      }
    } catch (error) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}