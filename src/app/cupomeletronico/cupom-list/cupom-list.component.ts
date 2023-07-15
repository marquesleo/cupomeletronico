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
  pacote:string='';
  filtrouPorUsuario = false;
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
    
      this.disableScanner = true; // desabilita o scanner após a leitura do QR code
    }
    
    
    ngOnInit() {
    
      if (!this.user.utilizaCupom){
        this.Aviso("Usuário não habilitado para cupom eletrônico!");
    
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
      this.pacote = '';
      if (qrcode.length > 0){
        this.pacote = qrcode[0].value;
        this.ListarPorNumeroDoPacote(this.pacote);
        
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

    Aviso(msg:string) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          icon: 'Check',
          message: msg
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
      this.canceling = false;
    }
    
    
    excluirLista(){
      this.cardData= [];
      this.canceling = false;
    }
    
    ListarPorNumeroDoPacoteDireto(){
    
      if (this.pacote)
        this.ListarPorNumeroDoPacote(this.pacote);  
      else
        this.Aviso("Preencha o número do pacote!");
        //this.alertService.error();  
    }
    
    
    
    ListarPorNumeroDoPacote(numeroDoPacote:any){
      this.busy = true;
      this.filtrouPorUsuario = false;
      this.cardData = [];
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
      this.filtrouPorUsuario = false;
      this.pacote = '';
      this.cardData =[];
      this.operacaoService.getAll(valor)
      .pipe(first ())
      .subscribe((card:CardData[])=> { 
          this.cardData = card;
          
          if (this.cardData?.length == 0){
            this.action.isReady.pipe(delay(1000)).subscribe(() => {
              this.handle(this.action, 'start');
            });
          }else{
            this.filtrouPorUsuario = true;
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
     
      this.loading = true;
      // reset alerts on submit


      this.alertService.clear();
      if (this.cardData.length == 0){
        this.Aviso("Nenhum Pacote foi selecionado");
        this.loading = false;
          return;
      }
      console.log('loading' +  this.loading);

      this.operacaoService.SalvarPacote(this.cardData)
      .pipe(first())
      .subscribe({
          next: () => {
            this.Confirmacao();
          
          
            if (this.filtrouPorUsuario) {
                  this.Listar(this.user.id);
            }else {
                  this.ListarPorNumeroDoPacote(this.pacote);
            }
          },
          error: error => {
              this.loading = false;
               this.Aviso(error);
              this.alertService.error(error);
            
           
          },
          complete: ()=> {
            this.loading = false;
            
          }
      });
   
     }

}
