import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { login, senha } = this.loginForm.value;
      this.authService.login(login, senha).subscribe({
        next: (res: any) => {
          this.authService.setToken(res.token);
          this.router.navigate(['/home']);
        },
        error: () => alert('Credenciais inválidas')
      });
    }
  }
}
