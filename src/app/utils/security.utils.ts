import { User } from "../models/user";



export class Security {
    public static set(user: User, token: string) {
        const data = JSON.stringify(user);

        localStorage.setItem('orcamento', btoa(data));
        localStorage.setItem('orcamento-token', token);
        localStorage.setItem('user-orcamento',data);
    }

    public static setUser(user: User) {
        const data = JSON.stringify(user);
        localStorage.setItem('orcamento', btoa(data));
    }

    public static setToken(token: string) {
        localStorage.setItem('orcamento-token', token);
    }

    public static getUser(): User {
        const data = localStorage.getItem('user-orcamento');
        if (data) {
            return JSON.parse(atob(data));
        } else {
            return null as any;
        }
    }

    public static getToken(): string {
        const data = localStorage.getItem('user-orcamento');
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
        localStorage.removeItem('orcamento');
        localStorage.removeItem('orcamento-token');
    }
}