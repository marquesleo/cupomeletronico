import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CupomLayoutComponent } from './cupom-layout/cupom-layout.component';
import { CupomListComponent } from './cupom-list/cupom-list.component';


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



