// Componente da Barra Superior e Navegação Principal
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private authService = inject(AuthService);

  // Retorna o nome do usuário logado
  obterNomeUsuario(): string {
    const usuario = this.authService.obterUsuarioLogado();
    return usuario ? usuario.nome : 'Administrador';
  }

  // Executa o logout da sessão
  sair(): void {
    this.authService.logout();
  }
}
