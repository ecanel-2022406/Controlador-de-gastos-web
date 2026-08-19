import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 40px; text-align: center;">
      <p>Has iniciado sesión correctamente.</p>
      
      <!-- Botón de Cerrar Sesión -->
      <button (click)="cerrarSesion()" style="padding: 10px 20px; background-color: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">
        Cerrar Sesión
      </button>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private intervalo: any;

  ngOnInit() {
    this.intervalo = setInterval(() => {
      this.verificarExpiracion();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  cerrarSesion() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    localStorage.removeItem('token');
  
    this.router.navigate(['/login']);
  }

  verificarExpiracion() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.salirAlLogin();
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      const expiracionMs = payloadDecoded.exp * 1000;
      
      if (Date.now() >= expiracionMs) {
        this.salirAlLogin();
      }
    } catch (error) {
      this.salirAlLogin();
    }
  }

  salirAlLogin() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}