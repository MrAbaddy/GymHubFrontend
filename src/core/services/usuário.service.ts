import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../environment/enviorenment';

export interface DadosUsuario {
  id: number;
  login: string;
  nome?: string;
  permissao?: string;
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
}
