// src/app/components/gerenciar-categorias/categoria.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriaService } from '../../service/categoria';

@Component({
  selector: 'app-gerenciar-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.html', 
  styleUrls: ['./categoria.css']
})
export class GerenciarCategoriasComponent {
 
  public categoriaService = inject(CategoriaService);

  novoNome = '';
  tipoSelecionado: 'receita' | 'despesa' | 'investimento' = 'despesa';
  
  idEmEdicao = signal<number | null>(null);
  nomeEdicao = '';

  adicionar(): void {
    if (!this.novoNome.trim()) return;
    this.categoriaService.adicionar(this.novoNome.trim(), this.tipoSelecionado);
    this.novoNome = '';
  }

  iniciarEdicao(cat: Categoria): void {
    this.idEmEdicao.set(cat.id);
    this.nomeEdicao = cat.nome;
  }

  salvarEdicao(): void {
    const id = this.idEmEdicao();
    if (!this.nomeEdicao.trim() || id === null) return;
    this.categoriaService.editar(id, this.nomeEdicao.trim());
    this.cancelarEdicao();
  }

  cancelarEdicao(): void {
    this.idEmEdicao.set(null);
    this.nomeEdicao = '';
  }

  deletar(id: number): void {
    if (confirm('Deseja realmente excluir esta categoria? Transações existentes com ela não serão apagadas.')) {
      this.categoriaService.deletar(id);
    }
  }
}