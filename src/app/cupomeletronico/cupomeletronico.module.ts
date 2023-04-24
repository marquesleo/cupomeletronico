import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CupomEletronicoRoutingModule } from './cupomeletronico-routing.module'; 
import { CupomListComponent } from './cupom-list/cupom-list.component';
import { CupomLayoutComponent } from './cupom-layout/cupom-layout.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CupomEletronicoRoutingModule,
    
    ],
    declarations: [
        CupomListComponent,
        CupomLayoutComponent,
        
        
    ]
})
export class CupomEletronicoModule { }