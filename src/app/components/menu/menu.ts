import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  
  @Output() aoSelecionar = new EventEmitter<string>();

  // Função para emitir a troca de tela
  navegarPara(idDaTela: string): void {
    this.aoSelecionar.emit(idDaTela);
  }
}