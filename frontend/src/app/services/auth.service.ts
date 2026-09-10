// Serviço Angular para Autenticação e Gestão de Sessão do Usuário
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { RespostaLogin, Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';


  private chaveToken = 'estetica_token';
  private chaveUsuario = 'estetica_usuario';

  // Realiza o login na API e armazena os dados da sessão
  login(email: string, senha: string): Observable<RespostaLogin> {
    return this.http.post<RespostaLogin>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap((res) => {
        if (res.sucesso && res.token) {
          localStorage.setItem(this.chaveToken, res.token);
          localStorage.setItem(this.chaveUsuario, JSON.stringify(res.usuario));
        }
      })
    );
  }

  // Encerra a sessão e redireciona para a tela de login
  logout(): void {
    localStorage.removeItem(this.chaveToken);
    localStorage.removeItem(this.chaveUsuario);
    this.router.navigate(['/login']);
  }

  // Retorna o token atual salvo
  obterToken(): string | null {
    return localStorage.getItem(this.chaveToken);
  }

  // Retorna os dados do usuário autenticado
  obterUsuarioLogado(): Usuario | null {
    const dados = localStorage.getItem(this.chaveUsuario);
    return dados ? JSON.parse(dados) : null;
  }

  // Verifica se o usuário está autenticado
  estaAutenticado(): boolean {
    return Boolean(this.obterToken());
  }
}
