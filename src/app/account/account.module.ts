import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component'; 
import { LoginComponent } from './login/login.component'; 
import { AccountRoutingModule } from './account-routing.module';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { CardData } from '../models/card';


import {
    ScannerQRCodeConfig,
    ScannerQRCodeSelectedFiles,
    NgxScannerQrcodeService,
    ScannerQRCodeResult,
    NgxScannerQrcodeComponent
  } from 'ngx-scanner-qrcode';
import { CardComponent } from '../componentes/card/card.component';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        NgQrScannerModule,
        FormsModule,
        NgxScannerQrcodeModule
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        CardComponent
        
        
    ]
})
export class AccountModule { }