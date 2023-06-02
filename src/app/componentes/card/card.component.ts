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
    this.nomeDoBotao="Concluído";
  }
  botaopadrao:string="btn btn-warning";
  botaoalterado:string="btn btn-danger";
  cardpadrao:string="card text-white bg-primary mb-3";
  cardalterado:string="card bg-warning mb-3";
  flag:boolean = true;
  AlterarCard(): void {
   
     this.flag=!this.flag;
     this.cardData.concluido =  !this.cardData.concluido
     if (!this.flag){
       this.nomeDoBotao = "Desfazer";
     } else
       this.nomeDoBotao = "Concluído";
  }

  isValidYear(date: Date): boolean {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const minYear = 1900;
      const maxYear = 2100;
      return year >= minYear && year <= maxYear;
    }
    return false;
  }

  isDataValida() {
    return this.isValidYear(this.cardData.dataConclusao);
  }

      

}
