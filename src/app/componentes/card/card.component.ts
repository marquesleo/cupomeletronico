import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { CardData } from 'src/app/models/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() cardData: CardData;
  constructor() { }
  nomeDoBotao:string="Concluído";
  ngOnInit(): void {
   
     if (this.cardData.foiFeita)
          this.nomeDoBotao = "Concluído";
      else{

      if (!this.flag){
           this.nomeDoBotao = "Lançado";
      }else
        this.nomeDoBotao = "Aberto";
     }
    
  }
  botaopadrao:string="btn btn-warning";
  botaoalterado:string="btn btn-danger";
  cardpadrao:string="card text-white bg-primary mb-3";
  cardalterado:string="card bg-warning mb-3";
  flag:boolean = true;
  AlterarCard(): void {
   
     this.flag=!this.flag;
     this.cardData.concluido =  !this.cardData.concluido

      if (this.cardData.foiFeita)
          this.nomeDoBotao = "Concluído";
      else{

      if (!this.flag){
           this.nomeDoBotao = "Lançado";
      }else
        this.nomeDoBotao = "Aberto";
     }
    }
  isValidYear(date: Date): boolean {
    if (date ) {
      const year = date.getFullYear();
      const minYear = 1900;
      const maxYear = 2100;
      return year >= minYear ;
    }
    return false;
  }

  HabilitaCampo() {
     if (this.isValidYear(this.cardData.dataConclusao))
     return true;
     else
     return false;
  }

      

}
