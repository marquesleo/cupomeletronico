import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineOfflineService {
  private status = navigator.onLine;

  get isOnline() {
    return this.status;
  }

  get isOffline() {
    return !this.status;
  }

  constructor() {
    window.addEventListener('online', () => {
      //this.setStatus(true);
    });

    window.addEventListener('offline', () => {
     // this.setStatus(false);
    });
  }


}