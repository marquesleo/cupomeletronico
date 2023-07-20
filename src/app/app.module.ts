import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import {MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { AlertComponent } from './componentes/alert/alert.component';
import { appInitializer } from './helpers/app.initializer';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AccountService } from './services/account.service';
import { NotFoundComponent } from './componentes/error-pages/not-found/not-found.component';
import { InternalServerComponent } from './componentes/error-pages/internal-server/internal-server.component';
import { CorsInterceptor } from './helpers/CorsInterceptor';
import { ConfirmationDialogComponent } from './componentes/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './componentes/confirmation-dialog/confirmation-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClient } from '@angular/common/http';
import { AlertDialogComponent } from './componentes/alert-dialog/alert-dialog.component';


export const loadEnvironmentConfig = (http: HttpClient) => {
  return () => {
    return http.get<any>('/assets/config/env.json').toPromise()
      .then(config => {
        environment.apiUrl = config.APIURL;
      })
      .catch(error => {
        console.error('Erro ao carregar configuração do ambiente', error);
        // Trate o erro adequadamente, como definir um valor padrão para a propriedade apiUrl
      });
  };
};




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlertComponent,
    NotFoundComponent,
    InternalServerComponent,
    ConfirmationDialogComponent,
    AlertDialogComponent,
     
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule, 
    MatIconModule, 
    MatRadioModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatDatepickerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    

  ],
  providers: [
    ConfirmationDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: APP_INITIALIZER, useFactory: loadEnvironmentConfig, multi: true, deps: [HttpClient] },
  ],
  entryComponents: [ ConfirmationDialogComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
