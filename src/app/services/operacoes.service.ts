import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models';
import { CardData } from '../models/card';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class OperacoesService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  localStorage: Storage;
  constructor(
      private http: HttpClient,
      private accountService: AccountService
  ) {}

  public get userValue(): any {
    return this.accountService.userValue;
  }

  getAll(id_usuario:number) {
    var url = environment.apiUrl;
    return this.http.get<CardData[]>(`${url}/v1/Operacao/${id_usuario}`);
  }
  getByIdPacote(id_pacote:number) {
    var url = environment.apiUrl;
    return this.http.get<CardData[]>(`${url}/v1/Operacao/ObterPorPacote/${id_pacote}`);
  }
  SalvarPacote(operacoes: CardData[]) {
    var url = environment.apiUrl;
    const idfuncionario = this.userValue?.id;
    operacoes.forEach(i=> i.idFuncionario = idfuncionario);
    return this.http.post<CardData[]>(`${url}/v1/Operacao`, operacoes);
  }
}
