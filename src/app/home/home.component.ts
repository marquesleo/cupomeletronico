import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  user: User;

    constructor(private accountService: AccountService,
      private router:Router,
      private alertService: AlertService) {
        this.user = this.accountService.userValue;
        
    }
    ngOnInit(): void {

      if (this.user.utilizaCupom)
           this.router.navigate(['/cupomeletronico']);
      else {
        this.alertService.warn("Usuário não habilitado para cupom eletrônico!");
      }
    }
 

}
