// src/app/service/transacao.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage'; 
import { MOCK_DATA_EXTERNO } from './mock';

export interface Transacao {
  id: number;
  tipo: 'receita' | 'despesa' | 'investimento';
  descricao: string;
  categoria: string;
  data: Date | string;
  valor: number;
}

@Injectable({ providedIn: 'root' })
export class Services {
  private storage = inject(StorageService);

  private transacoesSignal = signal<Transacao[]>(this.carregarDadosIniciais());
  transacoes = this.transacoesSignal.asReadonly();

  
  private dataFiltroSignal = signal<string>(this.obterMesAtual());
  dataFiltro = this.dataFiltroSignal.asReadonly();

  
  filtroTipo = signal<string>('todos');
  dataInicio = signal<string>('');
  dataFim = signal<string>('');

  private carregarDadosIniciais(): Transacao[] {
    const salvos = this.storage.obter();
    return (salvos && salvos.length > 0) ? salvos : MOCK_DATA_EXTERNO;
  }

  private obterMesAtual(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  }

  alterarMesFiltro(anoMes: string): void {
    this.dataFiltroSignal.set(anoMes);
  }

  
  totais = computed(() => {
    const listaCompleta = this.transacoesSignal();
    const filtroMes = this.dataFiltroSignal();

    const listaDoMes = listaCompleta.filter(t => {
      const dataTransacao = new Date(t.data);
      const ano = dataTransacao.getFullYear();
      const mes = String(dataTransacao.getMonth() + 1).padStart(2, '0');
      return `${ano}-${mes}` === filtroMes;
    });

    const entradas = listaDoMes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + (t.valor || 0), 0);
    const saidas = listaDoMes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + (t.valor || 0), 0);
    const investimentos = listaDoMes.filter(t => t.tipo === 'investimento').reduce((acc, t) => acc + (t.valor || 0), 0);
    
    return { 
      entradas, 
      saidas, 
      investimentos,
      saldo: entradas - saidas - investimentos
    };
  });

 
  transacoesFiltradas = computed(() => {
    const listaCompleta = this.transacoesSignal();
    const tipo = this.filtroTipo();
    const inicio = this.dataInicio();
    const fim = this.dataFim();

    return listaCompleta.filter(t => {
      // Filtro por Tipo
      if (tipo !== 'todos' && t.tipo !== tipo) return false;

      // Filtro por Intervalo de Datas
      if (inicio || fim) {
        const dataTransacao = new Date(t.data);
        dataTransacao.setHours(0, 0, 0, 0);

        if (inicio) {
          const dtInicio = new Date(inicio);
          dtInicio.setHours(0, 0, 0, 0);
          dtInicio.setTime(dtInicio.getTime() + dtInicio.getTimezoneOffset() * 60000);
          if (dataTransacao < dtInicio) return false;
        }

        if (fim) {
          const dtFim = new Date(fim);
          dtFim.setHours(0, 0, 0, 0);
          dtFim.setTime(dtFim.getTime() + dtFim.getTimezoneOffset() * 60000);
          if (dataTransacao > dtFim) return false;
        }
      }

      return true;
    });
  });

  // ==========================================
  // OPERAÇÕES DE CRUD (Mutações de Estado)
  // ==========================================

  adicionar(t: Omit<Transacao, 'id'>): void {
    const lista = this.transacoesSignal();
    const novoId = lista.length ? Math.max(...lista.map(i => i.id)) + 1 : 1;
    const novaLista = [...lista, { ...t, id: novoId }];
    this.transacoesSignal.set(novaLista);
    this.storage.salvar(novaLista);
  }

  editar(id: number, dados: Partial<Transacao>): void {
    this.transacoesSignal.update(lista => {
      const novaLista = lista.map(t => t.id === id ? { ...t, ...dados } : t);
      this.storage.salvar(novaLista);
      return novaLista;
    });
  }

  deletar(id: number): void {
    this.transacoesSignal.update(lista => {
      const novaLista = lista.filter(t => t.id !== id);
      this.storage.salvar(novaLista);
      return novaLista;
    });
  }
}