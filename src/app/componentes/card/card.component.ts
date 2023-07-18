import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardData } from 'src/app/models/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() cardData: CardData;
  @Output() tempo = new EventEmitter<number>();


  constructor() { }
  ngOnInit(): void {
    
  }
  botaopadrao:string="btn btn-warning";
  botaoalterado:string="btn btn-danger";
  cardpadrao:string="card text-white bg-primary ";
  cardalterado:string="card bg-warning";
 
  AlterarCard(): void {
   
    this.cardData.flag=!this.cardData.flag;
     this.cardData.concluido =  !this.cardData.concluido
     if (!this.cardData.flag){
       this.cardData.nomeDoBotao = "Desfazer";
       this.tempo.emit(this.cardData.tempoTotal);
     } else{
       this.cardData.nomeDoBotao = "Concluído";
       this.tempo.emit(0);
       
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
