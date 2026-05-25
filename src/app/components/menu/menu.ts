import { Component, EventEmitter, Output, Input } from '@angular/core'; // Injetado o Input
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  label: string;
  id: string;
  icon: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  
  @Input() telaAtiva: string = 'todas'; 
  
  @Output() aoSelecionar = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    { label: 'Perfil Financeiro', id: 'perfil-financeiro', icon: 'attach_money' },
    { label: 'Resumo Financeiro', id: 'dashboard', icon: 'trending_up' },
    { label: 'Transações', id: 'transação', icon: 'swap_horiz' }
  ];

  navegarPara(idDaTela: string): void {
    this.aoSelecionar.emit(idDaTela);
  }
}