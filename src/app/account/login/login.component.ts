import {
  Component,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output
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


  enum ScannerState {
  INIT = 'INIT',
  STARTING_CAMERA = 'STARTING_CAMERA',
  SCANNING = 'SCANNING',
  QR_DETECTED = 'QR_DETECTED',
  LOGGING_IN = 'LOGGING_IN',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  RESTARTING = 'RESTARTING'
}
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
  state: ScannerState = ScannerState.INIT;
  


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
  }

  setState(newState: ScannerState) {

  this.state = newState;
  console.log("STATE:", newState);

  switch (newState) {

    case ScannerState.STARTING_CAMERA:
      this.startScanner();
      break;

    case ScannerState.SCANNING:
      this.isProcessing = false;
      break;

    case ScannerState.QR_DETECTED:
      this.action.stop().subscribe();
      break;

    case ScannerState.LOGGING_IN:
      break;

    case ScannerState.SUCCESS:
      window.location.href = '/cupomeletronico';
      break;

    case ScannerState.ERROR:
      this.restartScanner();
      break;

    case ScannerState.RESTARTING:
      this.restartScanner();
      break;
  }
}


  ngAfterViewInit() {

   setTimeout(() => {
      this.setState(ScannerState.STARTING_CAMERA);
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
                
              
             }else{
                 this.changeCamera(devices[0].deviceId);
             }

             this.setState(ScannerState.SCANNING);

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

  onEvent(qrcode:ScannerQRCodeResult[]): void{

    if (this.state !== ScannerState.SCANNING) return;

     if (!qrcode?.length) return;

      const valor = qrcode[0].value;

      this.lastCode = valor;

     this.setState(ScannerState.QR_DETECTED);

    this.Logar(valor);

  }

  restartScanner() {

   this.state = ScannerState.RESTARTING;

  this.scannerEnabled = false;
  
   setTimeout(() => {

      this.scannerEnabled = true;

      setTimeout(() => {
        this.setState(ScannerState.STARTING_CAMERA);
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
   
  this.setState(ScannerState.LOGGING_IN);

  this.accountService.login(valor)
    .pipe(
      first())
    .subscribe({
      next: () => {
        this.setState(ScannerState.SUCCESS);
      },
      error: (err) => {
        this.alertService.clear();
        this.alertService.error(err);
        this.setState(ScannerState.ERROR);

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