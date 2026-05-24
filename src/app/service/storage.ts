import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEY = 'transacoes_db';

  salvar(dados: any[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(dados));
  }

  obter(): any[] {
    const dados = localStorage.getItem(this.KEY);
    return dados ? JSON.parse(dados) : [];
  }
}