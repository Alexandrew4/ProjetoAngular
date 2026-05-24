import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// CORREÇÃO 1: Ajuste o caminho de volta até a raiz de app/services/nome_do_seu_arquivo
// Se o arquivo do seu serviço na pasta services se chamar 'transacao.ts', mude o final para '/transacao'
import { Services } from '../../service/transacao';

type PerfilType = 'conservador' | 'moderado' | 'arrojado';

interface ConfigPerfil {
  nome: string;
  limiteMax: number;
  desc: string;
}

@Component({
  selector: 'app-perfil-financeiro',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    MatIconModule,
    MatTooltipModule
  ],
  // CORREÇÃO 2: Alinhado para apontar exatamente para o arquivo HTML correto da sua pasta perfil
  templateUrl: './perfil.html', 
  styleUrls: ['./perfil.css'] // Certifique-se de que seu CSS se chama perfil.css também
})
export class PerfilFinanceiroComponent {
  // CORREÇÃO 3: Forçando a tipagem estrita para o TypeScript saber o que existe em .totais()
  private financeService = inject(Services) as Services;

  protected readonly Math = Math;
  perfilSelecionado = signal<PerfilType>('moderado');

  perfisConfig: Record<PerfilType, ConfigPerfil> = {
    conservador: { nome: 'Conservador', limiteMax: 0.50, desc: 'Meta de gastar no máximo 50% da renda.' },
    moderado: { nome: 'Moderado', limiteMax: 0.70, desc: 'Meta de gastar no máximo 70% da renda.' },
    arrojado: { nome: 'Arrojado', limiteMax: 0.85, desc: 'Meta de gastar no máximo 85% da renda.' }
  };

  totalReceitas = computed(() => this.financeService.totais().entradas);
  totalDespesas = computed(() => this.financeService.totais().saidas);

  dadosTempo = computed(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
    const diaAtual = hoje.getDate();
    const diasRestantes = Math.max(ultimoDiaMes - diaAtual, 1);

    return { diasRestantes, ultimoDiaMes };
  });

  analiseFinanceira = computed(() => {
    const perfil = this.perfilSelecionado();
    const config = this.perfisConfig[perfil];
    const receitas = this.totalReceitas();
    const despesasAtuais = this.totalDespesas();
    const diasRestantes = this.dadosTempo().diasRestantes;

    const limiteTotalGastos = receitas * config.limiteMax;
    const saldoDisponivelParaGastar = Math.max(limiteTotalGastos - despesasAtuais, 0);
    const margemGastoDiario = saldoDisponivelParaGastar / diasRestantes;

    const percentualDoLimiteAtingido = limiteTotalGastos > 0 
      ? (despesasAtuais / limiteTotalGastos) * 100 
      : 0;

    return {
      limiteTotalGastos,
      saldoDisponivelParaGastar,
      margemGastoDiario,
      percentualDoLimiteAtingido,
      estourouMeta: despesasAtuais > limiteTotalGastos
    };
  });

  mudarPerfil(novoPerfil: PerfilType) {
    this.perfilSelecionado.set(novoPerfil);
  }
}