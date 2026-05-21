import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() aoSelecionar = new EventEmitter<string>();
  

  // Lista de itens do menu
  menuItems: MenuItem[] = [
    { label: 'Dashboard', id: 'dashboard', icon: 'trending_up' },
    { label: 'Perfil Financeiro', id: 'perfil-financeiro', icon: 'attach_money' }
  ];

  navegarPara(idDaTela: string): void {
    this.aoSelecionar.emit(idDaTela);
  }
}