import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Services } from '../../service/transacao';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resumo.html',
  styleUrl: './resumo.css',
})
export class Resumo {
  private transacaoService = inject(Services);

  
  mesSelecionado = this.transacaoService.dataFiltro;


  listaResumo = computed(() => {
    const valores = this.transacaoService.totais();
    return [
      { label: 'Entrada', value: valores.entradas, icone: 'arrow_upward', ordemMobile: 1 },
      { label: 'Gasto', value: valores.saidas, icone: 'arrow_downward', ordemMobile: 2 },
      { label: 'Investimento', value: valores.investimentos, icone: 'trending_up', ordemMobile: 3 },
      { label: 'Saldo', value: valores.saldo, icone: 'account_balance_wallet', ordemMobile: 4 }
    ];
  });


  onMesChange(evento: Event): void {
    const elemento = evento.target as HTMLInputElement;
    if (elemento?.value) {
      this.transacaoService.alterarMesFiltro(elemento.value);
    }
  }



}