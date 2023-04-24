import { AccountService } from "../services/account.service";
import { Subscription } from "rxjs";


export function appInitializer(authenticationService: AccountService) {
    return () => new Promise<void>((resolve) => {
        // attempt to refresh token on app start up to auto authenticate
        authenticationService.refreshToken()
            .subscribe({
                complete: () => {
                    resolve();
                },
                error: error => {
                    resolve();
                },
                  
            });
    });
}