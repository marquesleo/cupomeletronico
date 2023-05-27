import { catchError, of, tap } from "rxjs";
import { AccountService } from "../services/account.service";


export function appInitializer(authenticationService: AccountService) {
    return () => authenticationService.refreshTokenCupom()
    .pipe(
        // catch error to start app on success or failure
        catchError(() => of())
    );
}