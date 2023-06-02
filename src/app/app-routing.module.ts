import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './helpers/auth.guards'; 
import { NotFoundComponent } from './componentes/error-pages/not-found/not-found.component';
import { InternalServerComponent } from './componentes/error-pages/internal-server/internal-server.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const cupomModule = ()=> import('./cupomeletronico/cupomeletronico.module').then(x=> x.CupomEletronicoModule);


const routes: Routes = [
    
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },
 { path: 'cupomeletronico', loadChildren: cupomModule, canActivate: [AuthGuard] },
  { path: '404', component : NotFoundComponent},
  { path: '500', component: InternalServerComponent },
  //{ path: 'caixa', loadChildren: CaixaModule, canActivate: [AuthGuard] },
   // otherwise redirect to home
   { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
