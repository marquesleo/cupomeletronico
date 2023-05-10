import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../account/layout/layout.component'; 
import { CupomLayoutComponent } from './cupom-layout/cupom-layout.component';
import { CupomListComponent } from './cupom-list/cupom-list.component';
import { CardComponent } from '../componentes/card/card.component';


const routes: Routes = [
    { 
      path: '',
      component: CupomLayoutComponent,
      

     
      children: [
        { path: '',component: CupomListComponent}, 
        
     ]
    }
]

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CupomEletronicoRoutingModule { }



