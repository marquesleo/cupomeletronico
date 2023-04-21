import { AfterViewInit,Component,  ViewChild, ViewEncapsulation,HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import {QrScannerComponent} from 'angular2-qrscanner';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements AfterViewInit {
  disableScanner = false;
  form!: FormGroup ;
  loading = false;
  submitted = false;
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private qrcode: NgxScannerQrcodeService
    
) { }



onScanSuccess(qrCode: Event) {
  console.log(qrCode.target);
  this.disableScanner = true; // desabilita o scanner após a leitura do QR code
}


ngOnInit() {
  this.form = this.formBuilder.group({
      username: ['1', Validators.required],
      combo: ['',Validators.required]
    });
  }

// convenience getter for easy access to form fields
get f() { return this.form.controls; }


ngAfterViewInit(): void {
 
}

public onEvent(qrcode: ScannerQRCodeResult[]): void {
  if (qrcode.length > 0){
    const valor = qrcode[0].value;
    this.Gravar(valor);
  }
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
  this.Gravar("");  
}

Gravar(codigoQrCode:string) {
   this.submitted = true;

  // reset alerts on submit
  this.alertService.clear();

  // stop here if form is invalid
  if (this.form.invalid) {
      return;
  }

  this.loading = true;
  this.accountService.login(codigoQrCode)
       .subscribe((data:any)=>{
       // get return url from query parameters or default to home page
       const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
       this.router.navigateByUrl(returnUrl);
    },
     (err)=> {
       
      this.alertService.error(err);
      this.loading = false;
     }
    );
}  
  
}