import { Component, signal } from '@angular/core';
import { Menu } from './components/menu/menu';
import { Resumo } from './components/resumo/resumo';
import { FormularioComponent } from './components/formulario/formulario';
import { Tabela } from './components/tabela/tabela';
import { PerfilFinanceiroComponent } from './components/perfil/perfil';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Tabela, 
    Menu, 
    Resumo, 
    FormularioComponent, 
    PerfilFinanceiroComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Começa mostrando todas as telas juntas por padrão
  telaAtual: string = 'todas'; 

  mudarTela(idDaNovaTela: string): void {
    // Se clicar na aba que já está aberta, ela desativa e mostra "todas"
    if (this.telaAtual === idDaNovaTela) {
      this.telaAtual = 'todas';
    } else {
      // Senão, ativa apenas a tela clicada
      this.telaAtual = idDaNovaTela;
    }
  }

  protected readonly title = signal('projeto-angular');
}