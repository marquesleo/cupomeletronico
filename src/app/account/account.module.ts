import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component'; 
import { LoginComponent } from './login/login.component'; 
import { AccountRoutingModule } from './account-routing.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';


import {
    ScannerQRCodeConfig,
    ScannerQRCodeSelectedFiles,
    NgxScannerQrcodeService,
    ScannerQRCodeResult,
    NgxScannerQrcodeComponent
  } from 'ngx-scanner-qrcode';
import { SafePipe } from './login/safe.pipe';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        FormsModule,
        NgxScannerQrcodeModule
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        SafePipe
              
        
    ]
})
export class AccountModule { }