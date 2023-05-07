import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CupomEletronicoRoutingModule } from './cupomeletronico-routing.module'; 
import { CupomListComponent } from './cupom-list/cupom-list.component';
import { CupomLayoutComponent } from './cupom-layout/cupom-layout.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CupomEletronicoRoutingModule,
        NgQrScannerModule,
        FormsModule,
        NgxScannerQrcodeModule,
        MatToolbarModule,
        MatCardModule,
        MatButtonModule, 
      
    ],
    declarations: [
        CupomListComponent,
        CupomLayoutComponent,
        
        
    ]
})
export class CupomEletronicoModule { }