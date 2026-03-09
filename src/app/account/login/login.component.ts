import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {
  NgxScannerQrcodeComponent,
  ScannerQRCodeConfig,
  ScannerQRCodeDevice,
  ScannerQRCodeResult
} from 'ngx-scanner-qrcode';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  form!: FormGroup;
  loading = false;
  submitted = false;

  scannerEnabled = true;

  devices: ScannerQRCodeDevice[] = [];
  selectedDeviceId!: string;

  @ViewChild('action')
  action!: NgxScannerQrcodeComponent;

  config: ScannerQRCodeConfig = {
    vibrate: 400,
    deviceActive: 0,
    constraints: {
      audio: false,
      video: {
        width: window.innerWidth
      }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      username: ['', Validators.required]
    });

  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.startScanner();
    }, 300);

  }

  startScanner() {

    if (!this.action) return;

    this.action.start().subscribe(() => {

      this.action.devices.subscribe((devices) => {

        this.devices = devices;

          if (!devices || devices.length === 0) return;

            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            console.log(navigator.userAgent);

             if (isMobile) {
               // 📱 tenta pegar câmera traseira
                 const backCamera = devices.find(d =>
                  /back|rear|environment/gi.test(d.label)
                );

                console.log("Câmeras encontradas:", devices);
                console.log("Câmera traseira selecionada:", backCamera);


               if (backCamera) {
                 this.action.playDevice(backCamera.deviceId);
                 this.selectedDeviceId = backCamera.deviceId;
               }
             }else{
                this.selectedDeviceId = devices[0].deviceId;

             }

      });

    });

  }

  changeCamera(deviceId: string) {

    this.selectedDeviceId = deviceId;

    if (this.action) {
      this.action.playDevice(deviceId);
    }

  }

  onEvent(qrcode: ScannerQRCodeResult[]) {

    if (!qrcode || qrcode.length === 0) return;

    const valor = qrcode[0].value;

    this.action.pause().subscribe();

    this.Logar(valor);

  }

  restartScanner() {

    this.scannerEnabled = false;

    setTimeout(() => {
      this.scannerEnabled = true;
    }, 200);

  }

  Logar(valor:string) { 
    this.accountService.login(valor).subscribe
      ((data:any)=>
       { 
        this.router.navigate(['/cupomeletronico']);
       },
       (err)=> 
       { this.alertService.clear();
         this.alertService.error(err);
         this.loading = false;
        } 
     );
  }

  Gravar(valor: string) {

    this.submitted = true; // reset alerts on submit 
    this.alertService.clear(); // stop here if form is invalid 
    if (this.form.invalid) { return; }


    if (!valor) {
      valor = this.form.controls["username"].value;
    }

    this.Logar(valor);

   
  }

  ngOnDestroy() {

    if (this.action) {
      this.action.stop().subscribe();
    }

  }

  get f() {
    return this.form.controls;
  }

}