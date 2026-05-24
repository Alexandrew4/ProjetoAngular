import { Component, Output, EventEmitter, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Services } from '../../service/transacao';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.html',
  styleUrls: ['./tabela.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ]
})
export class Tabela {
  private transacaoService = inject(Services);

  @Output() editar = new EventEmitter<any>();

  colunasExibidas: string[] = ['data', 'descricao', 'categoria', 'tipo', 'valor', 'acoes'];

  // Signals para os filtros
  filtroSelecionado = signal<string>('todos');
  dataInicio = signal<string>('');
  dataFim = signal<string>('');

  // O computed observa as mudanças em todos os filtros automaticamente
  dataSource = computed(() => {
    let listaFiltrada = this.transacaoService.transacoes();
    const tipo = this.filtroSelecionado();
    const inicio = this.dataInicio();
    const fim = this.dataFim();

    // 1. Filtro por Tipo (Receita/Despesa/Investimento)
    if (tipo !== 'todos') {
      listaFiltrada = listaFiltrada.filter(t => t.tipo === tipo);
    }

    // 2. Filtro por Período de Datas
    if (inicio || fim) {
      listaFiltrada = listaFiltrada.filter(t => {
        const dataTransacao = new Date(t.data);
        
        // Zera as horas para comparar apenas os dias (evita bugs de fuso horário)
        dataTransacao.setHours(0, 0, 0, 0);

        if (inicio) {
          const dtInicio = new Date(inicio);
          dtInicio.setHours(0, 0, 0, 0);
          // Adiciona compensação de fuso caso o input venha como UTC puro
          dtInicio.setTime(dtInicio.getTime() + dtInicio.getTimezoneOffset() * 60000);
          if (dataTransacao < dtInicio) return false;
        }

        if (fim) {
          const dtFim = new Date(fim);
          dtFim.setHours(0, 0, 0, 0);
          dtFim.setTime(dtFim.getTime() + dtFim.getTimezoneOffset() * 60000);
          if (dataTransacao > dtFim) return false;
        }

        return true;
      });
    }

    return new MatTableDataSource<any>(listaFiltrada);
  });

  alterarFiltro(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.filtroSelecionado.set(elemento.value);
  }

  alterarDataInicio(event: Event): void {
    const elemento = event.target as HTMLInputElement;
    this.dataInicio.set(elemento.value);
  }

  alterarDataFim(event: Event): void {
    const elemento = event.target as HTMLInputElement;
    this.dataFim.set(elemento.value);
  }

  limparFiltroData(): void {
    this.dataInicio.set('');
    this.dataFim.set('');
  }

  carregarEdicao(transacao: any): void {
    this.editar.emit(transacao);
  }

  deletarTransacao(id: number): void {
    this.transacaoService.deletar(id);
  }
}