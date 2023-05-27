import {  OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { AfterViewInit,Component,  ViewChild, ViewEncapsulation,HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { User } from 'src/app/models';
import { CardData } from 'src/app/models/card';
import { OperacoesService } from 'src/app/services/operacoes.service';
import { first } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/componentes/confirmation-dialog/confirmation-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'src/app/componentes/confirmation-dialog/confirmation-dialog.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  user: User;
  buscaPacote:string;
  disableScanner = false;
  form!: FormGroup ;
  loading = false;
  submitted = false;
  produto:string="";
  nomeDoOperador:string="";
  pageSize = 10;
  public paginaAtual = 1;
  public busy: boolean = false;

 //  MediaDeviceInfo : MediaDeviceInfo = null!;
 // @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;

 public config: ScannerQRCodeConfig = {
  // fps: 1000,
  vibrate: 400,
  // isBeep: true,
  // decode: 'macintosh',
  deviceActive: 0, // Camera 1 active
  constraints: { 
    audio: false,
    video: {
      width: window.innerWidth
    }
  } 
};


cardData: CardData[] = [];
  

public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];


@ViewChild('action') action: NgxScannerQrcodeComponent

    constructor(private accountService: AccountService,
                private formBuilder: FormBuilder,
                private alertService: AlertService,
                private qrcode: NgxScannerQrcodeService,
                private operacaoService:OperacoesService,
                public dialog: MatDialog) 
    {
     this.user = this.accountService.userValue;
        
    }

    onScanSuccess(qrCode: Event) {
      console.log(qrCode.target);
      this.disableScanner = true; // desabilita o scanner após a leitura do QR code
    }
    
    
    ngOnInit() {
    
      this.user = this.operacaoService.userValue;
      this.nomeDoOperador = this.user.nome; 
      this.Listar(this.user.id);
      this.form = this.formBuilder.group({
        pacote: [, Validators.required],
       
      });
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    
    
    ngAfterViewInit(): void {
     
    }
    
    public onEvent(qrcode: ScannerQRCodeResult[]): void {
      if (qrcode.length > 0){
        const valor = Number(qrcode[0].value);
        this.ListarPorNumeroDoPacote(valor);
        
      }
    }
    result: string = '';
    openConfirmationDialog() {
      const message = `Deseja Cancelar Pacotes?`;
    
      const dialogData = new ConfirmDialogModel("Confirma Operação?", message);
    
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
    
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        if (this.result){
          this.excluirLista();
        }
      });
    }
    
    
    excluirLista(){
      this.cardData= [];
    }
    
    ListarPorNumeroDoPacoteDireto(){
    
      if (this.buscaPacote)
       this.ListarPorNumeroDoPacote(this.buscaPacote);  
    }
    
    
    
    ListarPorNumeroDoPacote(numeroDoPacote:any){
      this.busy = true;
     
      this.operacaoService.getByIdPacote(numeroDoPacote)
      .pipe(first ())
      .subscribe((card:CardData[])=> { 
          this.cardData = card;
          this.busy = false;
          
      },
      (err)=> {
        this.busy = false;
        this.alertService.error(err);
      }
      );
    }
    
    Listar(valor :number):void {
      this.busy = true;
     
      this.operacaoService.getAll(valor)
      .pipe(first ())
      .subscribe((card:CardData[])=> { 
          this.cardData = card;
          this.busy = false;
          
      },
      (err)=> {
        this.busy = false;
        this.alertService.error(err);
      }
      );
    }
    
    public handle(action: NgxScannerQrcodeComponent, fn: string): void {
      action[fn]().subscribe(console.log, alert);
    }
    
    public onSelects(files: any): void {
      this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
      });
    }
     onSubmit() {
      this.submitted = true;
    
      // reset alerts on submit
      this.alertService.clear();
    
      // stop here if form is invalid
      /*if (this.form.invalid) {
          return;
      }*/
     
     // var pacote = this.form.controls["pacote"].value
      
      
       // this.ListarPorNumeroDoPacote(pacote)
    
     }

}
