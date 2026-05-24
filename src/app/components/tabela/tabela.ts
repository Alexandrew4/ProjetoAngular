import { Component, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Services } from '../../service/transacao';

@Component({
  selector: 'app-tabela', // Mudado para refletir o seletor que você quer
  templateUrl: './tabela.html',
  styleUrls: ['./tabela.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  
  ]
})

export class Tabela {
  // 1. Injeta o serviço diretamente na tabela
  private transacaoService = inject(Services);

  // 2. Evento para abrir o formulário em modo de edição (o app ainda precisa saber disso)
  @Output() editar = new EventEmitter<any>();

  colunasExibidas: string[] = ['data', 'descricao', 'categoria', 'tipo', 'valor', 'acoes'];

  // 3. Reatividade automática: toda vez que a lista mudar no serviço, a tabela atualiza
  dataSource = computed(() => {
    // Substitua '.transacoes()' pelo nome do Signal/lista que está no seu Services
    return new MatTableDataSource<any>(this.transacaoService.transacoes()); 
  });

  carregarEdicao(transacao: any): void {
    this.editar.emit(transacao);
  }

  deletarTransacao(id: number): void {
    // Executa a exclusão direto pelo serviço
    this.transacaoService.deletar(id);
  }
}