import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import {
  NgxScannerQrcodeComponent,
  ScannerQRCodeConfig,
  ScannerQRCodeDevice,
  ScannerQRCodeResult
} from 'ngx-scanner-qrcode';
import { filter, finalize, first } from 'rxjs';
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
    private accountService: AccountService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      username: ['', Validators.required]
    });

  this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {

    if (this.router.url.includes('login')) {
      this.restartScanner();
    }

  });


  }

  ngAfterViewInit() {

   setTimeout(() => {
      this.startScanner();
    }, 300);
  }

  startScanner() {

    if (!this.action) {
     // alert("Scanner não encontrado!");
      return;
    }
    this.action.start().subscribe(() => {

      this.action.devices.subscribe((devices) => {

        this.devices = devices;

          if (!devices || devices.length === 0) return;

            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            //alert(navigator.userAgent);

             if (isMobile) {
               // 📱 tenta pegar câmera traseira
                 const backCamera = devices.find(d => /back|rear/gi.test(d.label) );

               // alert("Câmeras encontradas:" +  backCamera);
                //alert("Câmera traseira selecionada:" +  devices[1].deviceId);

         
                this.changeCamera(backCamera ? backCamera.deviceId : devices[0].deviceId);
                this.changeCamera(backCamera ? backCamera.deviceId : devices[0].deviceId);  
              
             }else{
                 this.changeCamera(devices[0].deviceId);
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

  isProcessing = false;
  lastCode: string | null = null;

  onEvent(qrcode: ScannerQRCodeResult[]) {

    if (!qrcode?.length) return;

    const valor = qrcode[0].value;

    // evita leituras repetidas
    if (this.isProcessing) return;

    if (this.lastCode === valor) return;

    this.isProcessing = true;
    this.lastCode = valor;

    this.action.stop().subscribe(); // desliga a câmera

    this.Logar(valor);

  }

  restartScanner() {

   this.isProcessing = false;
   this.lastCode = null;
   this.scannerEnabled = false;
  
   setTimeout(() => {

      this.scannerEnabled = true;

      setTimeout(() => {
        this.startScanner();
      }, 300);

    }, 200);

}

   handle(action: any, fn: string): void {
      
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

 Logar(valor: string): void {
  this.loading = true;
  this.isProcessing = true;

  this.accountService.login(valor)
    .pipe(
      first(),
      finalize(() => {
        this.loading = false;
        this.isProcessing = false;
      })
    )
    .subscribe({
      next: () => {
        window.location.href = '/cupomeletronico';
      },
      error: (err) => {
        this.alertService.clear();
        this.alertService.error(err);
        this.restartScanner();
      }
    });
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