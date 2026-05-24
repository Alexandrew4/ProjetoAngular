import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage'; 

export interface Categoria {
  id: number;
  nome: string;
  tipo: 'receita' | 'despesa' | 'investimento';
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private storage = inject(StorageService);
  private readonly STORAGE_KEY = 'categorias_db';

  private readonly DEFAULT_CATEGORIAS: Categoria[] = [
    { id: 1, nome: 'Salário', tipo: 'receita' },
    { id: 2, nome: 'Freelance', tipo: 'receita' },
    { id: 3, nome: 'Alimentação', tipo: 'despesa' },
    { id: 4, nome: 'Moradia', tipo: 'despesa' },
    { id: 5, nome: 'Transporte', tipo: 'despesa' },
    { id: 6, nome: 'Renda Fixa (LCI/LCA)', tipo: 'investimento' },
    { id: 7, nome: 'Ações', tipo: 'investimento' }
  ];

  private categoriasSignal = signal<Categoria[]>(this.carregarDados());
  categorias = this.categoriasSignal.asReadonly();

  private carregarDados(): Categoria[] {
    const dados = localStorage.getItem(this.STORAGE_KEY);
    return dados ? JSON.parse(dados) : this.DEFAULT_CATEGORIAS;
  }

  private atualizarEGravar(novaLista: Categoria[]): void {
    this.categoriasSignal.set(novaLista);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(novaLista));
  }

  adicionar(nome: string, tipo: 'receita' | 'despesa' | 'investimento'): void {
    const lista = this.categoriasSignal();
    const jaExiste = lista.some(c => c.nome.toLowerCase() === nome.toLowerCase() && c.tipo === tipo);
    if (jaExiste) return;

    const novoId = lista.length ? Math.max(...lista.map(c => c.id)) + 1 : 1;
    const novaLista = [...lista, { id: novoId, nome, tipo }];
    this.atualizarEGravar(novaLista);
  }

  editar(id: number, novoNome: string): void {
    const listaAtual = this.categoriasSignal();
    const novaLista = listaAtual.map(c => c.id === id ? { ...c, nome: novoNome } : c);
    this.atualizarEGravar(novaLista);
  }

  deletar(id: number): void {
    const listaAtual = this.categoriasSignal();
    const novaLista = listaAtual.filter(c => c.id !== id);
    this.atualizarEGravar(novaLista);
  }
}