// src/app/components/formulario/formulario.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Services, Transacao } from '../../service/transacao';
import { CategoriaService } from '../../service/categoria';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class FormularioComponent {
  private transacaoService = inject(Services);
  private categoriaService = inject(CategoriaService);

  editandoId = signal<number | null>(null);
  criandoNovaCategoria = signal<boolean>(false); 

  descricao = '';
  valor: number | null = null;
  tipo = signal<'receita' | 'despesa' | 'investimento'>('despesa');
  categoria = '';
  data = '';


  categoriasFiltradas = computed(() => {
    const tipoAtual = this.tipo();
    return this.categoriaService.categorias().filter(c => c.tipo === tipoAtual);
  });

  preencherFormulario(transacao: Transacao): void {
    this.editandoId.set(transacao.id);
    this.criandoNovaCategoria.set(false); // Reseta para o select em edição
    this.descricao = transacao.descricao;
    this.valor = transacao.valor;
    this.tipo.set(transacao.tipo);
    this.categoria = transacao.categoria;
    
    const d = new Date(transacao.data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    this.data = `${ano}-${mes}-${dia}`;
  }

  mudarTipo(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    const novoTipo = elemento.value as 'receita' | 'despesa' | 'investimento';
    this.tipo.set(novoTipo);
    this.categoria = ''; 
    this.criandoNovaCategoria.set(false); 
  }

  alternarModoCategoria(): void {
    this.criandoNovaCategoria.update(atual => !atual);
    this.categoria = ''; 
  }

  salvar(): void {
    if (!this.descricao || this.valor === null || this.valor <= 0 || !this.data || !this.categoria.trim()) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const categoriaNome = this.categoria.trim();

    
    if (this.criandoNovaCategoria()) {
      const jaExiste = this.categoriasFiltradas().some(c => c.nome.toLowerCase() === categoriaNome.toLowerCase());
      if (!jaExiste) {
        this.categoriaService.adicionar(categoriaNome, this.tipo());
      }
    }

    const dadosFormulario: Omit<Transacao, 'id'> = {
      descricao: this.descricao,
      valor: this.valor,
      tipo: this.tipo(),
      categoria: categoriaNome,
      data: new Date(this.data + 'T00:00:00')
    };

    const idAtual = this.editandoId();

    if (idAtual !== null) {
      this.transacaoService.editar(idAtual, dadosFormulario);
    } else {
      this.transacaoService.adicionar(dadosFormulario);
    }

    this.limparFormulario();
  }

  limparFormulario(): void {
    this.editandoId.set(null);
    this.criandoNovaCategoria.set(false);
    this.descricao = '';
    this.valor = null;
    this.tipo.set('despesa');
    this.categoria = '';
    this.data = '';
  }
}