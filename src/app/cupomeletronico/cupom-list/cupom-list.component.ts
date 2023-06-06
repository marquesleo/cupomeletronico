import { AfterViewInit,Component,  ViewChild, ViewEncapsulation,HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeDevice, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { AccountService } from 'src/app/services/account.service';
import { Alert, User } from 'src/app/models';
import { CardData } from 'src/app/models/card';
import { OperacoesService } from 'src/app/services/operacoes.service';
import { first } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'src/app/componentes/confirmation-dialog/confirmation-dialog.component';
import { delay } from 'rxjs';
import { AlertComponent } from 'src/app/componentes/alert/alert.component';
import { AlertDialogComponent } from 'src/app/componentes/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-cupom-list',
  templateUrl: './cupom-list.component.html',
  styleUrls: ['./cupom-list.component.css']
})
export class CupomListComponent implements AfterViewInit {
  user: User;
  cardData:CardData[]=[];
  buscaPacote:string;
  disableScanner = false;
  form!: FormGroup ;
  loading = false;
  canceling = false;
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

public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];


@ViewChild('action') action: NgxScannerQrcodeComponent

    constructor(private accountService: AccountService,
                private formBuilder: FormBuilder,
                private alertService: AlertService,
                private qrcode: NgxScannerQrcodeService,
                private operacaoService:OperacoesService,
                public  dialog: MatDialog,
                private router:Router) 
    {
     this.user = this.accountService.userValue;
        
    }

    onScanSuccess(qrCode: Event) {
      console.log(qrCode.target);
      this.disableScanner = true; // desabilita o scanner após a leitura do QR code
    }
    
    
    ngOnInit() {
    
      if (!this.user.utilizaCupom){
        this.alertService.warn("Usuário não habilitado para cupom eletrônico!");
        this.router.navigate(['/cupomeletronico']);
      }else{

      this.user = this.operacaoService.userValue;
      this.nomeDoOperador = this.user.nome; 
   
      this.form = this.formBuilder.group({
        pacote: [, Validators.required],
       
      });
    }
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    
    
    ngAfterViewInit(): void {
      
      this.Listar(this.user.id);
    
    }

    public onEvent(qrcode: ScannerQRCodeResult[], action?: any): void {
      qrcode?.length && action && action.pause(); // Detect once and pause scan!
      console.log(qrcode);
      if (qrcode.length > 0){
        const valor = Number(qrcode[0].value);
        this.ListarPorNumeroDoPacote(valor);
        
      }
    }
    
    
    public handle(action: any, fn: string): void {
      

      const playDeviceFacingBack = (devices: ScannerQRCodeDevice[]) => {
        // front camera or back camera check here!
        const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
        action.playDevice(device ? device.deviceId : devices[0].deviceId);
      }
    
      if (fn === 'start') {
        action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
      } else {
        action[fn]().subscribe((r: any) => console.log(fn, r), alert);
      }
    }
    
    
    public onSelects(files: any): void {
      this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
      });
    }

    Confirmacao() {
      this.dialog.open(AlertDialogComponent, {
        data: {
          icon: 'Check',
          message: 'Pacote Enviado com sucesso'
        }
      });
    }

    result: string = '';
    openConfirmationDialog() {
      const message = `Deseja Cancelar Pacotes?`;
    
      const dialogData = new ConfirmDialogModel("Confirma Operação?", message);
    
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
      this.canceling = true;
      dialogRef.afterClosed().subscribe(dialogResult => {
       
        this.result = dialogResult;
        if (this.result){
          this.excluirLista();
        }
      });
    }
    
    
    excluirLista(){
      this.cardData= [];
      this.canceling = false;
    }
    
    ListarPorNumeroDoPacoteDireto(){
    
      if (this.buscaPacote)
        this.ListarPorNumeroDoPacote(this.buscaPacote);  
      else
        this.alertService.error("Preencha o número do pacote!");  
    }
    
    
    
    ListarPorNumeroDoPacote(numeroDoPacote:any){
      this.busy = true;
     
      this.operacaoService.getByIdPacote(numeroDoPacote)
      .pipe(first ())
      .subscribe((card:CardData[])=> { 
          this.alertService.clear();
          this.cardData = card;
          this.busy = false;
          
      },
      (err)=> {
        this.busy = false;
        this.alertService.clear();
        this.alertService.error(err,);
      }
      );
    }
    
    Listar(valor :number):void {
      this.busy = true;
     
      this.operacaoService.getAll(valor)
      .pipe(first ())
      .subscribe((card:CardData[])=> { 
          this.cardData = card;
          if (this.cardData?.length == 0){
            this.action.isReady.pipe(delay(1000)).subscribe(() => {
              this.handle(this.action, 'start');
            });
          }
          this.busy = false;
          
      },
      (err)=> {
        this.busy = false;
        this.alertService.error(err);
      },
      
      );
    }
    
   
     onSubmit() {
      this.submitted = true;
      this.loading = true;
      // reset alerts on submit
      this.alertService.clear();
      if (this.cardData.length == 0){
          this.alertService.error("Nenhum Pacote foi selecionado");
          return;
      }
      this.operacaoService.SalvarPacote(this.cardData)
      .pipe(first())
      .subscribe({
          next: () => {
            this.Confirmacao();
              this.Listar(this.user.id);
          },
          error: error => {
              this.alertService.error(error);
              this.loading = false;
          },
          complete: ()=> {
            this.loading = false;
            
          }
      });
    
     }

}
