import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './components/menu/menu';
import { Resumo } from './components/resumo/resumo';
import { FormularioComponent } from './components/formulario/formulario';
import { Tabela } from './components/tabela/tabela';
import { PerfilFinanceiroComponent } from './components/perfil/perfil';

@Component({
  selector: 'app-root',
  standalone: true, // <--- ADICIONE ESTA LINHA AQUI
  imports: [RouterOutlet, Tabela, Menu, Resumo, FormularioComponent,PerfilFinanceiroComponent ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

  telaAtual:string = 'home';

  mudarTela(idDaNovaTela:string){
    this.telaAtual=idDaNovaTela;
  }

  protected readonly title = signal('projeto-angular');
}
