import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service'; // Verifique se o caminho está correto

@Component({
  selector: 'app-registrar-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './registrar-component.html', // Liga com o seu HTML
  styleUrl: './registrar-component.css'
})
export class RegistrarComponent {
  // AQUI está a variável 'form' que o HTML estava procurando e não achava
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      login: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // AQUI está a função 'onSubmit' que o HTML estava procurando
  onSubmit() {
    if (this.form.valid) {
      const { nome, login, senha } = this.form.value;

      this.authService.register(nome, login, senha).subscribe({
        next: () => {
          console.log('Sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro no cadastro', err);
        }
      });
    }
  }
}
