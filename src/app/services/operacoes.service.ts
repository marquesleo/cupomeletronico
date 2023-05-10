import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models';
import { CardData } from '../models/card';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class OperacoesService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  localStorage: Storage;
  constructor(
      private http: HttpClient
  ) {
       this.user = this.userSubject.asObservable();
       this.localStorage = window.localStorage;
       var item = JSON.parse(localStorage.getItem(AccountService.usercupomeletronico) || '{}');
       this.userSubject = new BehaviorSubject<User>(item);
       this.user = this.userSubject.asObservable();
  }

  private get userValue(): any {
    return this.userSubject.value;
  }


  getAll(valor:string) {
    const id_usuario = this.userValue?.Id;
       
     return this.http.get<CardData[]>(`${environment.apiUrl}/v1/Operacao/${id_usuario}`);
 }
}
