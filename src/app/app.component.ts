import { Component, HostListener } from '@angular/core';

import { AccountService } from './services/account.service'; 
import { User } from './models';
import { Router } from '@angular/router';
//import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
     user: User;
     online: boolean = navigator.onLine;
     constructor(private accountService: AccountService) {

        this.accountService.user.subscribe(x => this.user = x);

    }

    ngOnInit() {
        this.online = navigator.onLine;
    }

    isLogado():boolean{
      if (this.accountService.userValue.id && 
          this.accountService.userValue.id > 0)
          return true;

          
      return false;    
    }

    logout() {
        this.accountService.logout();
    }

    syncData() {
        console.log('sincronizando');
      }

    @HostListener('window:online', ['$event'])
    onOnline(event: Event) {
      this.online = true;
      this.syncData();
    }
  
    @HostListener('window:offline', ['$event'])
    onOffline(event: Event) {
      this.online = false;
    }


}