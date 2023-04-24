import { User } from "../models/user";



export class Security {

   private static cupomeletronico_usuario:string ="cupomeletronico"
   private static cupomeletronico_token:string="orcamento-token"

    public static set(user: User, token: string) {
        const data = JSON.stringify(user);

       
        localStorage.setItem(this.cupomeletronico_token, token);
        localStorage.setItem(this.cupomeletronico_usuario,data);
    }

    public static setUser(user: User) {
        const data = JSON.stringify(user);
        localStorage.setItem(this.cupomeletronico_usuario, btoa(data));
    }

    public static setToken(token: string) {
        localStorage.setItem(this.cupomeletronico_token, token);
    }

    public static getUser(): User {
        const data = localStorage.getItem(this.cupomeletronico_usuario);
        if (data) {
            return JSON.parse(atob(data));
        } else {
            return null as any;
        }
    }

    public static getToken(): string {
        const data = localStorage.getItem(this.cupomeletronico_usuario);
        if (data) {
            return data;
        } else {
            return null as any;
        }
    }

    public static hasToken(): boolean {
        if (this.getToken())
            return true;
        else
            return false;
    }

    public static clear() {
        localStorage.removeItem(this.cupomeletronico_usuario);
        localStorage.removeItem(this.cupomeletronico_token);
    }
}