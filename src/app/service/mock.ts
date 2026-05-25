// src/app/service/transacoes.mock.ts
import { Transacao } from './transacao';

export const MOCK_DATA_EXTERNO: Transacao[] = [
  // ==========================================
  // MARÇO / 2026 (2 meses para trás)
  // ==========================================
  { id: 1, tipo: 'receita', descricao: 'Salário Mensal', categoria: 'Salário', data: new Date('2026-03-01T10:00:00'), valor: 6500.00 },
  { id: 2, tipo: 'receita', descricao: 'Venda de Eletrônico usado', categoria: 'Extras', data: new Date('2026-03-12T15:30:00'), valor: 450.00 },
  { id: 3, tipo: 'despesa', descricao: 'Aluguel e Condomínio', categoria: 'Moradia', data: new Date('2026-03-05T08:00:00'), valor: 1600.00 },
  { id: 4, tipo: 'despesa', descricao: 'Supermercado Mensal', categoria: 'Alimentação', data: new Date('2026-03-08T19:15:00'), valor: 720.50 },
  { id: 5, tipo: 'despesa', descricao: 'Abastecimento Suzuki Jimny', categoria: 'Transporte', data: new Date('2026-03-15T11:20:00'), valor: 240.00 },
  { id: 6, tipo: 'despesa', descricao: 'Restaurante Fim de Semana', categoria: 'Lazer', data: new Date('2026-03-22T21:00:00'), valor: 185.90 },
  { id: 7, tipo: 'investimento', descricao: 'Tesouro Selic 2029', categoria: 'Renda Fixa', data: new Date('2026-03-10T14:00:00'), valor: 800.00 },

  // ==========================================
  // ABRIL / 2026 (1 mês para trás)
  // ==========================================
  { id: 8, tipo: 'receita', descricao: 'Salário Mensal', categoria: 'Salário', data: new Date('2026-04-01T10:00:00'), valor: 6500.00 },
  { id: 9, tipo: 'receita', descricao: 'Rendimento de Dividendos', categoria: 'Investimentos', data: new Date('2026-04-15T12:00:00'), valor: 125.50 },
  { id: 10, tipo: 'despesa', descricao: 'Aluguel e Condomínio', categoria: 'Moradia', data: new Date('2026-04-05T08:00:00'), valor: 1600.00 },
  { id: 11, tipo: 'despesa', descricao: 'Supermercado Quinzenal', categoria: 'Alimentação', data: new Date('2026-04-06T18:30:00'), valor: 410.20 },
  { id: 12, tipo: 'despesa', descricao: 'Fatura Internet Fibra', categoria: 'Serviços', data: new Date('2026-04-10T09:00:00'), valor: 119.90 },
  { id: 13, tipo: 'despesa', descricao: 'Troca de Óleo - Oficina', categoria: 'Transporte', data: new Date('2026-04-18T14:10:00'), valor: 350.00 },
  { id: 14, tipo: 'despesa', descricao: 'Cinema e Lanche', categoria: 'Lazer', data: new Date('2026-04-25T22:00:00'), valor: 95.00 },
  { id: 15, tipo: 'investimento', descricao: 'Aporte Ações B3 (Aché/Eurofarma)', categoria: 'Renda Variável', data: new Date('2026-04-12T10:30:00'), valor: 1200.00 },

  // ==========================================
  // MAIO / 2026 (Mês Atual)
  // ==========================================
  { id: 16, tipo: 'receita', descricao: 'Salário Mensal', categoria: 'Salário', data: new Date('2026-05-01T10:00:00'), valor: 6500.00 },
  { id: 17, tipo: 'despesa', descricao: 'Aluguel e Condomínio', categoria: 'Moradia', data: new Date('2026-05-05T08:00:00'), valor: 1600.00 },
  { id: 18, tipo: 'despesa', descricao: 'Feira de Hortifrúti', categoria: 'Alimentação', data: new Date('2026-05-12T09:45:00'), valor: 185.00 },
  { id: 19, tipo: 'despesa', descricao: 'Assinatura Streaming', categoria: 'Serviços', data: new Date('2026-05-20T06:00:00'), valor: 55.90 },
  { id: 20, tipo: 'investimento', descricao: 'LCI Banco Inter', categoria: 'Renda Fixa', data: new Date('2026-05-10T11:00:00'), valor: 1500.00 }
];