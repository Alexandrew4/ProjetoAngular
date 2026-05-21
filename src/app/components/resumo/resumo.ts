import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Services } from '../../service/transacao';

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo.html',
  styleUrl: './resumo.css',
})
export class Resumo {
  private transacaoService = inject(Services);

  // O computed monitora o sinal 'totais' do seu serviço.
  // Sempre que o serviço atualizar a lista, este signal dispara um recálculo aqui.
  listaResumo = computed(() => {
    const valores = this.transacaoService.totais();
    return [
      { label: 'Entrada', value: valores.entradas, classe: 'entrada' },
      { label: 'Gasto', value: valores.saidas, classe: 'gasto' },
      { label: 'Saldo', value: valores.saldo, classe: 'saldo' }
    ];
  });
}