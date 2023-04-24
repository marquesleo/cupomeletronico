import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  public notFoundText : string = "404 PÁGINA NÃO ENCONTRADA!!!"
  constructor() { }
  ngOnInit(): void {
  }

}
