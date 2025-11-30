import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatIcon,
    MatButton
  ],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'login', 'permissao', 'acoes'];
  dataSource: DadosUsuario[] = [];
  usuarioLogado: any = null;

  formUsuario!: FormGroup;
  editandoUsuario: DadosUsuario | null = null;
  usuarioParaExcluir: DadosUsuario | null = null;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;

  dialogRef!: MatDialogRef<any>;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.usuarioLogado = this.authService.getUser();
    this.carregarUsuarios();

    this.formUsuario = this.fb.group({
      nome: ['', Validators.required],
      login: ['', [Validators.required, Validators.email]],
      senha: [''],
      permissao: ['', Validators.required]
    });
  }

  carregarUsuarios() {
    this.usuarioService.listarTodos().subscribe({
      next: (dados) => {
        this.dataSource = dados;
      },
      error: (err) => {
        console.error('Erro ao listar usuários', err);
      }
    });
  }

  abrirDialog(usuario?: DadosUsuario) {
    this.formUsuario.get('senha')?.clearValidators();

    if (usuario) {
      this.editandoUsuario = usuario;
      this.formUsuario.patchValue(usuario);
      this.formUsuario.get('senha')?.setValidators([Validators.minLength(6)]);
      this.formUsuario.get('senha')?.setValue('');
    } else {
      this.editandoUsuario = null;
      this.formUsuario.reset();
      this.formUsuario.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    this.formUsuario.get('senha')?.updateValueAndValidity();

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px',
      disableClose: true
    });
  }

  salvarUsuario() {
    if (this.formUsuario.invalid) return;

    const usuarioForm: DadosUsuario = this.formUsuario.value;

    if (this.editandoUsuario) {
      this.usuarioService.atualizar(this.editandoUsuario.id, usuarioForm).subscribe({
        next: () => {
          this.carregarUsuarios();
          this.dialogRef.close();
        },
        error: (err) => console.error('Erro ao atualizar', err)
      });
    } else {
      this.usuarioService.criar(usuarioForm).subscribe({
        next: () => {
          this.carregarUsuarios();
          this.dialogRef.close();
        },
        error: (err) => console.error('Erro ao criar', err)
      });
    }
  }

  excluirUsuario(usuario: DadosUsuario) {
    this.usuarioParaExcluir = usuario;
    this.dialogRef = this.dialog.open(this.confirmDialogTemplate, {
      width: '350px'
    });
  }

  confirmarExclusao() {
    if (this.usuarioParaExcluir) {
      this.usuarioService.excluir(this.usuarioParaExcluir.id).subscribe({
        next: () => {
          this.carregarUsuarios();
          this.dialogRef.close();
          this.usuarioParaExcluir = null;
        },
        error: (err) => console.error('Erro ao excluir', err)
      });
    }
  }

  fecharDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  logout() {
    this.authService.logout();
  }
}
