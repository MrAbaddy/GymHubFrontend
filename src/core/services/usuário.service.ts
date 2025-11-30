import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../environment/enviorenment';

export interface DadosUsuario {

  id: number;
  login: string;
  nome: string;
  permissao: string;
  senha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API = `${env.apiUrl}/gymhub/usuario`;

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<DadosUsuario[]> {
    return this.http.get<DadosUsuario[]>(this.API);
  }

  criar(usuario: DadosUsuario): Observable<DadosUsuario> {
    return this.http.post<DadosUsuario>(this.API, usuario);
  }

  atualizar(id: number, usuario: DadosUsuario): Observable<DadosUsuario> {
    const url = `${this.API}/${id}`;
    return this.http.put<DadosUsuario>(url, usuario);
  }

  excluir(id: number): Observable<void> {
    const url = `${this.API}/${id}`;
    return this.http.delete<void>(url);
  }
}
