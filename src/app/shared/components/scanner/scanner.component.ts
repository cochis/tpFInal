import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {
  loading = false
  currentDevice!: MediaDeviceInfo
  hasDevices!: boolean
  hasPermission!: boolean
  qrResult!: any
  guestExist!: boolean | null;
  guest!: any
  @Output() qr!: EventEmitter<object>;
  constructor() {

    this.qr = new EventEmitter()
  }
  onCodeResult(resultString: string): void {

    this.guestExist = null;
    this.readQr(resultString)


  }

  //Permission for the app to use the device camera
  onHasPermission(has: boolean): void {

    this.hasPermission = has;

  }



  clearMessage() {
    setTimeout(() => {
      this.guestExist = null;
    }, 3000);
  }

  readQr(res: string) {
    this.loading = true
    setTimeout(() => {
      let q = JSON.parse(res)
      let invitado = {
        ok: true,
        data: q
      }
      this.qr.emit(invitado)
      this.clearMessage();
      this.loading = false
    }, 500);
  }
}
