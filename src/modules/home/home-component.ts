import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth-service';
import { UsuarioService, DadosUsuario } from '../../core/services/usuário.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'login', 'permissao'];
  dataSource: DadosUsuario[] = [];
  usuarioLogado: any = null;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {

    this.usuarioLogado = this.authService.getUser();

    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.listarTodos().subscribe({
      next: (dados) => {
        this.dataSource = dados;
        console.log('Usuários carregados:', dados);
      },
      error: (err) => {
        console.error('Erro ao listar usuários', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
