import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  protected onSubmit() {
    console.log('Botão clicado. Formulário válido?', this.form.valid);

    if (this.form.valid) {
      const {login, senha} = this.form.value;

      this.authService.login(login, senha).subscribe({
        next: (response) => {
          console.log('Login com sucesso, token', response.token);
          this.authService.setToken(response.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login falhou', err);
        }
      });
    } else {
      console.log('Formulário inválido, verifique os campos');
    }
  }
}
