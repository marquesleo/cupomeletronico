import { AfterViewInit,Component,  ViewChild, ViewEncapsulation,HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeDevice, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { delay } from 'rxjs';


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
      username: [, Validators.required],
      combo: ['',Validators.required]
    });
  }

// convenience getter for easy access to form fields
get f() { return this.form.controls; }


ngAfterViewInit(): void {
 this.action.isReady.pipe(delay(1000)).subscribe(() => {
    this.handle(this.action, 'start');
  });
}

public onEvent(qrcode: ScannerQRCodeResult[], action?: any): void {
  qrcode?.length && action && action.pause(); // Detect once and pause scan!
  console.log(qrcode);
  if (qrcode.length > 0){
    const valor = qrcode[0].value;
    this.Gravar(valor);
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


onSubmit() {
  this.Gravar("");  
}

Gravar(codigoQrCode:string) {
   this.submitted = true;

  // reset alerts on submit
  this.alertService.clear();

  // stop here if form is invalid
  /*if (this.form.invalid) {
      return;
  }*/
  if (!codigoQrCode){
     codigoQrCode = this.form.controls["username"].value
  }
  

  this.loading = true;
  this.accountService.login(codigoQrCode)
       .subscribe((data:any)=>{
       // get return url from query parameters or default to home page
       const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
       this.router.navigateByUrl(returnUrl);
    },
     (err)=> {
       this.alertService.clear();
      this.alertService.error(err);
      this.loading = false;
     }
    );
}  
  
}