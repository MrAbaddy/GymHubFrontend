import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'; // Adicionado ViewChild e TemplateRef
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; // Adicionado para o dropdown de permissão
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
    MatSelectModule, // Importante para o select de permissão
    FormsModule,
    ReactiveFormsModule
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

  // Referência ao template do modal no HTML
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  // Referência para poder fechar o modal via código se necessário
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

    // Inicializa o formulário base
    this.formUsuario = this.fb.group({
      nome: ['', Validators.required],
      login: ['', [Validators.required, Validators.email]],
      senha: [''], // Validadores adicionados dinamicamente no abrirDialog
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
        // Aqui você pode adicionar um SnackBar de erro
      }
    });
  }

  abrirDialog(usuario?: DadosUsuario) {
    // Limpa validadores de senha antigos para evitar conflitos
    this.formUsuario.get('senha')?.clearValidators();

    if (usuario) {
      // --- MODO EDIÇÃO ---
      this.editandoUsuario = usuario;
      this.formUsuario.patchValue(usuario);

      // Senha opcional na edição. Só valida se o usuário digitar algo.
      this.formUsuario.get('senha')?.setValidators([Validators.minLength(6)]);
      // O campo senha deve vir vazio para não sobrescrever a hash antiga com texto plano
      this.formUsuario.get('senha')?.setValue('');
    } else {
      // --- MODO CRIAÇÃO ---
      this.editandoUsuario = null;
      this.formUsuario.reset();

      // Senha obrigatória na criação
      this.formUsuario.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    // Atualiza o status do campo senha com os novos validadores
    this.formUsuario.get('senha')?.updateValueAndValidity();

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px', // Define uma largura padrão para não ficar espremido
      disableClose: true // Impede fechar clicando fora (opcional)
    });
  }

  salvarUsuario() {
    if (this.formUsuario.invalid) return;

    const usuarioForm: DadosUsuario = this.formUsuario.value;

    if (this.editandoUsuario) {
      // Atualizar
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
    if (confirm(`Deseja realmente excluir o usuário ${usuario.nome}?`)) {
      this.usuarioService.excluir(usuario.id).subscribe({
        next: () => {
          this.carregarUsuarios();
        },
        error: (err) => console.error('Erro ao excluir', err)
      });
    }
  }

  fecharDialog() {
    this.dialogRef.close();
  }

  logout() {
    this.authService.logout();
  }
}
