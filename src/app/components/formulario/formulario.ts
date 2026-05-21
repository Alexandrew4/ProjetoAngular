import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { Services } from '../../service/transacao';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTableModule,
    MatNativeDateModule
  ]
})
export class FormularioComponent implements OnInit {
  // Injeção de dependência moderna
  private transacaoService = inject(Services);
  private fb = inject(FormBuilder);

  transacaoForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  colunasExibidas: string[] = ['data', 'descricao', 'categoria', 'tipo', 'valor', 'acoes'];
  editandoId: number | null = null;
  categoriasFiltradas: string[] = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Outros'];

  constructor() {
    this.transacaoForm = this.fb.group({
      descricao: ['', Validators.required],
      categoria: ['', Validators.required],
      data: [new Date(), Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      tipo: ['despesa']
    });

    // Sincronização automática da tabela sempre que o sinal de transações mudar
    effect(() => {
      this.dataSource.data = this.transacaoService.transacoes();
    });
  }

  ngOnInit(): void {}

  // O HTML chama este método no (ngSubmit)
  onSubmit(): void {
    this.salvarTransacao();
  }

  get isEdicao(): boolean {
    return this.editandoId !== null;
  }

  salvarTransacao(): void {
    if (this.transacaoForm.invalid) return;

    if (this.isEdicao) {
      this.transacaoService.editar(this.editandoId!, this.transacaoForm.value);
    } else {
      this.transacaoService.adicionar(this.transacaoForm.value);
    }
    
    this.limparFormulario();
  }

// Adicione este método dentro da classe FormularioComponent
  cancelarEdicao(): void {
    this.limparFormulario();
  }

  carregarEdicao(transacao: any): void {
    this.editandoId = transacao.id;
    this.transacaoForm.patchValue(transacao);
  }

  deletarTransacao(id: number): void {
    this.transacaoService.deletar(id);
  }

  limparFormulario(): void {
    this.editandoId = null;
    this.transacaoForm.reset({ 
      tipo: 'despesa', 
      data: new Date(),
      valor: 0 
    });
  }
}