import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private httpClient: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(env.apiUrl + '/usuario');
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(env.apiUrl + '/usuario', usuario);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(env.apiUrl + `/usuario/${id}`);
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(env.apiUrl + `/usuario`, usuario);
  }
}
