// Componente de Autenticação e Login
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  mensagemErro = '';
  carregando = false;

  // Processa a validação e envio do login
  realizarLogin(): void {
    if (!this.email.trim() || !this.senha.trim()) {
      this.mensagemErro = 'Por favor, informe seu e-mail e senha para continuar.';
      return;
    }
    this.carregando = true;
    this.mensagemErro = '';
    this.authService.login(this.email.trim(), this.senha).subscribe({
      next: (res) => {
        this.carregando = false;
        if (res.sucesso) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.carregando = false;
        this.mensagemErro = err.error?.erro || 'Credenciais inválidas. Verifique seu e-mail e senha.';
      },
    });
  }
}
