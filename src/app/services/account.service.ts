import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { Security } from '../utils/security.utils';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    localStorage: Storage;
    public static usercupomeletronico :string  = "user-cupomfiscal"
    public static refreshTokencupomeletronico: string = "refreshToken-cupomeletronico";
    constructor(
        private router: Router,
        private http: HttpClient,
        private cookieService: CookieService
        
    ) {
        this.localStorage = window.localStorage;
        var item = JSON.parse(localStorage.getItem("cupomeletronico") || '{}');
        this.userSubject = new BehaviorSubject<User>(item);
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {

        
        return this.userSubject.value;
    }

    refreshTokenCupom() {
        var url = environment.apiUrl;
        var refreshtoken = this.getCookie(AccountService.refreshTokencupomeletronico);
        const reqHeader = new HttpHeaders().set("Content-type","application/json")
        .set("Accept","application/json");

        var accesstoken: string =   '';
        if (this.userSubject.value.token)
            accesstoken = this.userSubject.value.token;
       
        if (refreshtoken === 'undefined')
             refreshtoken = ''

         var idusuario = 0; 

         if (this.userSubject.value.id)
            idusuario = this.userSubject.value.id;

      
        return this.http.post<any>(`${url}/v1/usuario/refresh-token/`, 
            {idusuario, accesstoken,refreshtoken},{ headers: reqHeader})
            .pipe(map((user) => {
               
               if (user){
                 this.setUser(user,user.token);
                 this.userSubject.next(user);
                this.cookieService.delete(AccountService.refreshTokencupomeletronico);
                this.setCookie(AccountService.refreshTokencupomeletronico,user.refreshToken,7);
               
               }
                return user;
            }));
        
        
    }

    getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = `${name}=`;
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s+/g, '');
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return '';
    }

    private refreshTokenTimeout: any;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtBase64 = this.userValue!.token!.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshTokenCupom().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
    setCookie(name: string, value: string, expireDays: number,
             path: string = '') {
        let d:Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires:string = `expires=${d.toUTCString()}`;
        let cpath:string = path ? `; path=${path}` : '';
        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    }

    login(qrCode:string) {
        var url = environment.apiUrl;
        const usuario = { 
            id:0,
            nome:"",
            qrcode:qrCode
            
        };
        return this.http.post<User>(`${url}/v1/usuario/autenticar`, usuario)
            .pipe(          
                map(user => {
                  
                       // store user details and jwt token in local storage to keep user logged in between page refreshes
                        this.setUser(user,user.token);
                        this.userSubject.next(user);
                        this.setCookie(AccountService.refreshTokencupomeletronico,user.token,7);
                        this.startRefreshTokenTimer();
                   
                return user;
            }
          )
        );
    }

    private getServerErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 404: {
                return `Not Found: ${error.message}`;
            }
            case 403: {
                return `Access Denied: ${error.message}`;
            }
            case 500: {
                return `Internal Server Error: ${error.message}`;
            }
            default: {
                return `Unknown Server Error: ${error.message}`;
            }

        }
    }

    logout() {
       // remove user from local storage and set current user to null
        Security.clear();
        this.stopRefreshTokenTimer();
        var user: User = new User();
        this.userSubject.next(user);
        this.router.navigate(['/account/login']);
     }

    setUser(User:User, token:string){
        Security.set(User,token);
        this.router.navigate(['/']);
      }

     register(user: User) {
        var url = environment.apiUrl;
        return this.http.post(`${url}/v1/usuario`, user);
    }

     getAll() {
        var url = environment.apiUrl;
        return this.http.get<User[]>(`${url}/usuario`);
     }

     getById(id: number) {
        var url = environment.apiUrl;
        return this.http.get<User>(`${url}/usuario/ObterPorId/${id}`);
     }

    update(id:number, params:any) {
        var url = environment.apiUrl;
        return this.http.put(`${url}/v1/usuario/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem(AccountService. usercupomeletronico, JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: number) {
        var url = environment.apiUrl;
        return this.http.delete(`${url}/v1/usuario/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}