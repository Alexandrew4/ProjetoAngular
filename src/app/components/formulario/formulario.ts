import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

// CORREÇÃO DOS IMPORTS: Apontando para os arquivos físicos corretos
import { Services } from '../../service/transacao';
import { Categoria,CategoriaService } from '../../service/categoria';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule,
    MatButtonToggleModule, MatIconModule, MatNativeDateModule, MatTooltipModule
  ]
})
export class FormularioComponent implements OnInit {
  private transacaoService = inject(Services); // Classe correta vinculada!
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  transacaoForm: FormGroup;
  editandoId: number | null = null;
  hoje: Date = new Date();

  modoGerenciarCategorias = signal<boolean>(false);
  novaCategoriaNome = signal<string>('');
  idCategoriaEmEdicao = signal<number | null>(null);
  nomeCategoriaEdicao = signal<string>('');

  // CORREÇÃO: Forçando tipo 'cat: Categoria' para extinguir o erro implicit 'any'
  categoriasFiltradas = computed(() => {
    const tipoAtual = this.transacaoForm?.get('tipo')?.value || 'despesa';
    return this.categoriaService.categorias().filter((cat: Categoria) => cat.tipo === tipoAtual);
  });

  constructor() {
    this.transacaoForm = this.fb.group({
      descricao: ['', Validators.required],
      categoria: ['', Validators.required],
      data: [new Date(), [Validators.required, this.dataNaoFutura]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      tipo: ['despesa', Validators.required]
    });
  }

  ngOnInit(): void {
    this.transacaoForm.get('tipo')?.valueChanges.subscribe(() => {
      this.transacaoForm.get('categoria')?.setValue('');
      this.fecharGerenciadorCategorias();
    });
  }

  dataNaoFutura(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const dataSelecionada = new Date(control.value);
    const hoje = new Date();
    dataSelecionada.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
    return dataSelecionada > hoje ? { dataFutura: true } : null;
  }

  onSubmit(): void {
    if (this.transacaoForm.invalid) return;
   
   // Criamos uma cópia dos dados do formulário
  const dadosFormulario = { ...this.transacaoForm.value };

  // Força a data a se transformar em String ISO estável para evitar conflitos de fuso entre Objeto Date e String
  if (dadosFormulario.data instanceof Date) {
    dadosFormulario.data = dadosFormulario.data.toISOString();
  }

  if (this.isEdicao) {
    this.transacaoService.editar(this.editandoId!, dadosFormulario);
  } else {
    this.transacaoService.adicionar(dadosFormulario);
  }
    this.limparFormulario();
  }

  get isEdicao(): boolean { return this.editandoId !== null; }
  cancelarEdicao(): void { this.limparFormulario(); }

  receberDadosParaEdicao(transacao: any): void {
    this.editandoId = transacao.id;
    this.transacaoForm.patchValue(transacao);
  }

  limparFormulario(): void {
    this.editandoId = null;
    this.transacaoForm.reset({ tipo: 'despesa', data: new Date(), valor: null });
    this.fecharGerenciadorCategorias();
  }

  alternarGerenciadorCategorias(): void {
    this.modoGerenciarCategorias.update(v => !v);
    this.idCategoriaEmEdicao.set(null);
  }

  fecharGerenciadorCategorias(): void {
    this.modoGerenciarCategorias.set(false);
    this.idCategoriaEmEdicao.set(null);
    this.novaCategoriaNome.set('');
  }

  adicionarNovaCategoria(): void {
    const nome = this.novaCategoriaNome().trim();
    if (!nome) return;
    const tipoAtual = this.transacaoForm.get('tipo')?.value;
    this.categoriaService.adicionar(nome, tipoAtual);
    this.novaCategoriaNome.set('');
  }

  deletarCategoria(id: number): void {
    this.categoriaService.deletar(id);
    this.transacaoForm.get('categoria')?.setValue('');
  }

  iniciarEdicaoCategoria(cat: Categoria): void {
    this.idCategoriaEmEdicao.set(cat.id);
    this.nomeCategoriaEdicao.set(cat.nome);
  }

  salvarEdicaoCategoria(): void {
    const novoNome = this.nomeCategoriaEdicao().trim();
    const id = this.idCategoriaEmEdicao();
    if (id !== null && novoNome) {
      this.categoriaService.editar(id, novoNome);
      this.idCategoriaEmEdicao.set(null);
    }
  }
}