import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Aluno} from '../../../core/models/aluno';
import {AlunoService} from '../../../core/services/aluno-service';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-aluno-component',
  imports: [
    MatIcon,
    MatButton,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatLabel,
    MatError
  ],
  templateUrl: './aluno-component.html',
  styleUrl: './aluno-component.css',
})
export class AlunoComponent implements OnInit {
  editing = false;

  form: FormGroup = new FormGroup({});
  dados: Aluno[] = [];

  constructor(private alunoService: AlunoService, private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null],
      nome: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.alunoService.getAlunos().subscribe({
      next: (alunos) => {
        this.dados = alunos;
      },
      error: (err) => {
        console.error('Failed to fetch alunos:', err);
      }
    });
  }

  protected adicionarAluno() {
    if (this.form.valid) {
      const {nome, email} = this.form.value;
      this.alunoService.create({nome, email} as Aluno).subscribe({
        next: (aluno) => {
          this.dados = [...this.dados, aluno];
          this.resetForm();
        },
        error: (err) => {
          console.error('Failed to create aluno:', err);
        }
      });
    }
  }

  protected deletarAluno(aluno: Aluno) {
    this.alunoService.delete(aluno.id as number).subscribe({
      next: () => {
        this.dados = this.dados.filter(a => a.id !== aluno.id);
      },
      error: (err) => {
        console.error('Failed to delete aluno:', err);
      }
    });
  }

  protected editarAluno(aluno: Aluno) {
    this.editing = true;

    this.form.setValue({
      id: aluno.id,
      nome: aluno.nome,
      email: aluno.email
    });
  }

  protected atualizarAluno() {
    if (this.form.valid) {
      const {id, nome, email} = this.form.value;

      this.alunoService.update({id, nome, email} as Aluno).subscribe({
        next: (alunoAtualizado) => {
          this.dados = this.dados.map(aluno => aluno.id === id ? alunoAtualizado : aluno);
          this.resetForm();
        },
        error: (err) => {
          console.error('Failed to update aluno:', err);
        }
      });
    }
  }

  private resetForm() {
    this.form.reset();
    this.editing = false;
  }
}
