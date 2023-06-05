import { Component } from '@angular/core';
import { ConfigService } from '../services/Config.Service';

@Component({
  selector: 'app-my-component',
  template: `
    <h1>URL do ambiente: {{ apiUrl }}</h1>
  `
})
export class MyComponent {
  apiUrl: string;

  constructor(private configService: ConfigService) {
    this.configService.getConfig().subscribe((data: any) => {
      this.apiUrl = data.apiUrl;
    });
  }
}