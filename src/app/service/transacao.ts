import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage'; // Certifique-se de que o caminho está correto

export interface Transacao {
  id: number;
  tipo: 'receita' | 'despesa' | 'investimento'; // <-- Adicionado 'investimento' aqui
  descricao: string;
  categoria: string;
  data: Date;
  valor: number;
}

@Injectable({ providedIn: 'root' })
export class Services {
  private storage = inject(StorageService);

  // MOCK DE DADOS INICIAIS
  private readonly MOCK_DATA: Transacao[] = [
    { id: 1, tipo: 'receita', descricao: 'Salário Mensal', categoria: 'Salário', data: new Date(), valor: 5000 },
    { id: 2, tipo: 'despesa', descricao: 'Aluguel', categoria: 'Moradia', data: new Date(), valor: 1200 },
    { id: 3, tipo: 'despesa', descricao: 'Supermercado', categoria: 'Alimentação', data: new Date(), valor: 450.50 }
  ];

  private transacoesSignal = signal<Transacao[]>(this.carregarDadosIniciais());
  transacoes = this.transacoesSignal.asReadonly();

  private carregarDadosIniciais(): Transacao[] {
    const salvos = this.storage.obter();
    return (salvos && salvos.length > 0) ? salvos : this.MOCK_DATA;
  }

  // CALCULOS DOS TOTAIS ATUALIZADOS
  totais = computed(() => {
    const lista = this.transacoesSignal();
    
    const entradas = lista.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + (t.valor || 0), 0);
    const saidas = lista.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + (t.valor || 0), 0);
    
    // Calcula o total acumulado em investimentos de forma separada
    const investimentos = lista.filter(t => t.tipo === 'investimento').reduce((acc, t) => acc + (t.valor || 0), 0);
    
    // No saldo final, o investimento funciona como uma saída do caixa diário, mas um ganho patrimonial
    return { 
      entradas, 
      saidas, 
      investimentos,
      saldo: entradas - saidas - investimentos 
    };
  });

  adicionar(t: Omit<Transacao, 'id'>) {
    const lista = this.transacoesSignal();
    const novoId = lista.length ? Math.max(...lista.map(i => i.id)) + 1 : 1;
    const novaLista = [...lista, { ...t, id: novoId }];
    this.transacoesSignal.set(novaLista);
    this.storage.salvar(novaLista);
  }

  editar(id: number, dados: Partial<Transacao>) {
    this.transacoesSignal.update(lista => {
      const novaLista = lista.map(t => t.id === id ? { ...t, ...dados } : t);
      this.storage.salvar(novaLista);
      return novaLista;
    });
  }

  deletar(id: number) {
    this.transacoesSignal.update(lista => {
      const novaLista = lista.filter(t => t.id !== id);
      this.storage.salvar(novaLista);
      return novaLista;
    });
  }
}