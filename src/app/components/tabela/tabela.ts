

import { Component, Output, EventEmitter, inject, computed } from '@angular/core';
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
    CommonModule, MatTableModule, MatIconModule,
    MatButtonModule, MatTooltipModule, FormsModule
  ]
})
export class Tabela {
  protected transacaoService = inject(Services);

  @Output() editar = new EventEmitter<any>();

  colunasExibidas: string[] = ['data', 'descricao', 'categoria', 'tipo', 'valor', 'acoes'];

  
  filtroSelecionado = this.transacaoService.filtroTipo;
  dataInicio = this.transacaoService.dataInicio;
  dataFim = this.transacaoService.dataFim;

  dataSource = computed(() => {
    return new MatTableDataSource<any>(this.transacaoService.transacoesFiltradas());
  });

  alterarFiltro(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.transacaoService.filtroTipo.set(elemento.value);
  }

  alterarDataInicio(event: Event): void {
    const elemento = event.target as HTMLInputElement;
    this.transacaoService.dataInicio.set(elemento.value);
  }

  alterarDataFim(event: Event): void {
    const elemento = event.target as HTMLInputElement;
    this.transacaoService.dataFim.set(elemento.value);
  }

  limparFiltroData(): void {
    this.transacaoService.dataInicio.set('');
    this.transacaoService.dataFim.set('');
  }

  carregarEdicao(transacao: any): void {
    this.editar.emit(transacao);
  }

  deletarTransacao(id: number): void {
    this.transacaoService.deletar(id);
  }
}