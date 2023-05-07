import { Component, OnInit } from '@angular/core';
import { User } from '../models';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  user: User;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
        
    }

 

}
