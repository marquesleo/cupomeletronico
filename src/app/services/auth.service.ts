import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Security } from "../utils/security.utils"; 

@Injectable()
export class AuthService implements CanActivate {
    constructor(private router:Router){

    }
    canActivate(): boolean  {
        const token = Security.getToken();
        if (!token){
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

    
}