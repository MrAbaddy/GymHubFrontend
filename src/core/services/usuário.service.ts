import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../environment/enviorenment';

export interface DadosUsuario {
  id: number; // Agora o ID é obrigatório para a listagem
  login: string;
  nome: string;
  permissao: string;
  senha?: string; // Adicionado: Precisamos disso para enviar a senha no POST/PUT
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API = `${env.apiUrl}/gymhub/usuario`;

  constructor(private http: HttpClient) { }

  // GET: Listar todos
  listarTodos(): Observable<DadosUsuario[]> {
    return this.http.get<DadosUsuario[]>(this.API);
  }

  // POST: Criar novo usuário
  criar(usuario: DadosUsuario): Observable<DadosUsuario> {
    return this.http.post<DadosUsuario>(this.API, usuario);
  }

  // PUT: Atualizar usuário existente
  atualizar(id: number, usuario: DadosUsuario): Observable<DadosUsuario> {
    const url = `${this.API}/${id}`;
    return this.http.put<DadosUsuario>(url, usuario);
  }

  // DELETE: Excluir usuário
  excluir(id: number): Observable<void> {
    const url = `${this.API}/${id}`;
    return this.http.delete<void>(url);
  }
}
