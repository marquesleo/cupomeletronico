import { AfterViewInit,Component,  ViewChild, ViewEncapsulation,HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models';
import { CardData } from 'src/app/models/card';
import { OperacoesService } from 'src/app/services/operacoes.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-cupom-list',
  templateUrl: './cupom-list.component.html',
  styleUrls: ['./cupom-list.component.css']
})
export class CupomListComponent implements AfterViewInit {
  user : User;
  disableScanner = false;
  form!: FormGroup ;
  loading = false;
  submitted = false;
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


cardData: CardData[] = [
  {
    title: 'Card 1',
    subtitle: 'Subtitle 1',
    text: 'Text 1',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    title: 'Card 2',
    subtitle: 'Subtitle 2',
    text: 'Text 2',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    title: 'Card 3',
    subtitle: 'Subtitle 3',
    text: 'Text 3',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    title: 'Card 4',
    subtitle: 'Subtitle 4',
    text: 'Text 4',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    title: 'Card 5',
    subtitle: 'Subtitle 5',
    text: 'Text 5',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    title: 'Card 6',
    subtitle: 'Subtitle 6',
    text: 'Text 6',
    imageUrl: 'https://via.placeholder.com/150'
  }
];

public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];


@ViewChild('action') action: NgxScannerQrcodeComponent

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private qrcode: NgxScannerQrcodeService,
    private accountService:AccountService,
    private operacaoService:OperacoesService
    
) { }



onScanSuccess(qrCode: Event) {
  console.log(qrCode.target);
  this.disableScanner = true; // desabilita o scanner após a leitura do QR code
}


ngOnInit() {

  this.user = this.accountService.userValue;
}

// convenience getter for easy access to form fields
get f() { return this.form.controls; }


ngAfterViewInit(): void {
 
}

public onEvent(qrcode: ScannerQRCodeResult[]): void {
  if (qrcode.length > 0){
    const valor = qrcode[0].value;
    this.Listar(valor);
    
  }
}

Listar(valor :string):void {
  this.busy = true;
 
  this.operacaoService.getAll(valor)
  .pipe(first ())
  .subscribe((senha:CardData[])=> { 
      this.cardData = senha;
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
  
    }
  
}


