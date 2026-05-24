import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
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
    MatNativeDateModule,
      ]
})
export class FormularioComponent implements OnInit {
  private transacaoService = inject(Services);
  private fb = inject(FormBuilder);

  transacaoForm: FormGroup;
  editandoId: number | null = null;
  
  private categoriasReceita: string[] = ['Salário', 'Investimentos', 'Freelance', 'Outros'];
  private categoriasDespesa: string[] = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Moradia', 'Outros'];
  categoriasFiltradas: string[] = [];

  constructor() {
    this.transacaoForm = this.fb.group({
      descricao: ['', Validators.required],
      categoria: ['', Validators.required],
      data: [new Date(), Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      tipo: ['despesa', Validators.required]
    });
  }

  ngOnInit(): void {
    this.atualizarCategorias(this.transacaoForm.get('tipo')?.value);

    this.transacaoForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.atualizarCategorias(tipo);
      this.transacaoForm.get('categoria')?.setValue('');
    });
  }

  atualizarCategorias(tipo: 'receita' | 'despesa'): void {
    this.categoriasFiltradas = tipo === 'receita' ? this.categoriasReceita : this.categoriasDespesa;
  }

  onSubmit(): void {
    if (this.transacaoForm.invalid) return;
    this.salvarTransacao();
  }

  get isEdicao(): boolean {
    return this.editandoId !== null;
  }

  salvarTransacao(): void {
    if (this.isEdicao) {
      this.transacaoService.editar(this.editandoId!, this.transacaoForm.value);
    } else {
      this.transacaoService.adicionar(this.transacaoForm.value);
    }
    this.limparFormulario();
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  // Método disparado quando a tabela emitir o evento de edição
  receberDadosParaEdicao(transacao: any): void {
    this.editandoId = transacao.id;
    this.transacaoForm.patchValue(transacao);
  }

  limparFormulario(): void {
    this.editandoId = null;
    this.transacaoForm.reset({ 
      tipo: 'despesa', 
      data: new Date(),
      valor: null
    });
  }
}