import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';



@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor() { }

  async prepare() {
    BarcodeScanner.prepare();
  }


  async checkPermission() {
    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  };

  async startScan() {

    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return
      }
      await BarcodeScanner.hideBackground()

      document.querySelector('body')!.classList.add('scanner-active');
      setTimeout(() => {
        this.stopScan()
        document.querySelector('body')!.classList.remove('scanner-active');
      }, 5000);
      const result = await BarcodeScanner.startScan()

      if (result?.hasContent) {
        BarcodeScanner.showBackground()
        this.stopScan()
        return await result.content
      }
      else {
        return
      }
    } catch (error) {
      console.log('error::: ', error);

      document.querySelector('body')!.classList.remove('scanner-active');

      this.stopScan()
      return
    }

  }

  stopScan() {
    document.querySelector('body')!.classList.remove('scanner-active');
    BarcodeScanner.showBackground()
    BarcodeScanner.stopScan()
  }
}
